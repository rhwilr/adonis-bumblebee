'use strict'

const { ioc } = require('@adonisjs/fold')
const { trimEnd: _trimEnd } = require('lodash')

const TransformerAbstract = require('./TransformerAbstract')
const Resources = require('./Resources')

/**
 * Scope class
 *
 * @class Scope
 * @constructor
 */
class Scope {
  /**
   * Create a new Scope class
   *
   * @param {*} manager
   * @param {*} resource
   * @param {*} ctx
   * @param {*} scopeIdentifier
   */
  constructor (manager, resource, ctx, scopeIdentifier = null) {
    this._manager = manager
    this._resource = resource
    this._ctx = ctx
    this._scopeIdentifier = scopeIdentifier
    this._parentScopes = []
  }

  /**
   * Passes the data through the transformers and serializers and returns the transformed data
   */
  async toJSON () {
    // run the transformation on the data
    const [rawData] = await this._executeResourceTransformers()

    // create a serializer instance
    const serializer = this._manager.getSerializer()

    // run the raw data through the serializer
    let data = await this._serializeResource(serializer, rawData)

    // initialize an empty meta object
    let meta = {}

    // if the resource is a collection and there is pagination data...
    if (this._resource instanceof Resources.Collection && this._resource.getPagination()) {
      // run the pagination data through the serializer and add it to the meta object
      const pagination = await serializer.paginator(this._resource.getPagination())
      meta = Object.assign(pagination, meta)
    }

    // if there is custom meta data, add it the our meta object
    if (this._resource.getMeta()) {
      meta = await serializer.meta(this._resource.getMeta())
    }

    // If any meta data has been added, add it to the response
    if (Object.keys(meta).length !== 0) {
      // If the serializer does not support meta data,
      // we just force the data object under a 'data' propert since we can not mix an array with objects
      if (Array.isArray(data) || (typeof data !== 'object' && data !== null)) {
        data = { data: data }
      }

      // merge data with meta data
      data = Object.assign(meta, data)
    }

    // all done, return the transformed data
    return data
  }

  /**
   * Creates a transformer instance and runs data through the transformer
   */
  async _executeResourceTransformers () {
    // get a transformer and fetch data from the resource
    const transformer = this._resource.getTransformer()
    const data = await this._resource.getData()

    let transformedData = []
    let includedData = []

    if (!data || this._resource instanceof Resources.Null) {
      // If the resource is a null-resource, set data to null without includes
      transformedData = null
      includedData = []
    } else if (this._resource instanceof Resources.Item) {
      // It the resource is an item, run the data through the transformer
      [transformedData, includedData] = await this._fireTransformer(data, transformer)
    } else if (this._resource instanceof Resources.Collection) {
      // It we have a collection, get each item from the array of data
      // and run each item individually through the transformer
      for (const value of data) {
        const [transformedValue, includedValue] = await this._fireTransformer(value, transformer)

        transformedData.push(transformedValue)
        includedData.push(includedValue)
      }
    } else {
      // If we are here, we have some unknown resource and can not transform it
      throw new Error('This resourcetype is not supported. Use Item or Collection')
    }

    return [transformedData, includedData]
  }

  /**
   * Runs an object of data through a transformer method
   *
   * @param {*} data
   * @param {*} transformer
   */
  async _fireTransformer (data, transformer) {
    let includedData = []

    // get a transformer instance and tranform data
    const transformerInstance = this._getTransformerInstance(transformer)
    let transformedData = await this._dispatchToTransformerVariant(transformerInstance, await data, this._ctx)

    // if this transformer has includes defined,
    // figure out which includes should be run and run requested includes
    if (this._transformerHasIncludes(transformerInstance)) {
      includedData = await transformerInstance._processIncludedResources(this, await data)
      transformedData = await this._manager.getSerializer().mergeIncludes(transformedData, includedData)
    }

    return [transformedData, includedData]
  }

  /**
   * Run data through a serializer
   *
   * @param {*} serializer
   * @param {*} rawData
   */
  async _serializeResource (serializer, rawData) {
    if (this._resource instanceof Resources.Collection) {
      return serializer.collection(rawData)
    }

    if (this._resource instanceof Resources.Item) {
      return serializer.item(rawData)
    }

    return serializer.null()
  }

  /**
   * Checks if this scope is requested by comparing the current nesting level with the requested includes
   *
   * @param {*} checkScopeSegment
   */
  _isRequested (checkScopeSegment) {
    let scopeArray

    // create the include string by combining current level with parent levels
    if (this._scopeIdentifier) {
      scopeArray = [...this._parentScopes, this._scopeIdentifier, checkScopeSegment]
    } else {
      // if this scope has no identifier, we are in the root scope
      scopeArray = [checkScopeSegment]
    }

    const scopeString = scopeArray.join('.')

    // check if this include was requested. If the include does not occur in the
    // requested includes, we check again, for it may have been requested using
    // snake_case instead of camelCase
    return this._manager.getRequestedIncludes().has(scopeString) ||
      this._manager.getRequestedIncludes(true).has(scopeString)
  }

  /**
   * Creates and returns a new transformer instance
   *
   * @param {*} Transformer
   */
  _getTransformerInstance (Transformer) {
    // if the transformer is a string, use the IoC to fetch the instance.
    if (typeof Transformer === 'string') {
      Transformer = this._resolveTransformer(Transformer)
    }

    // if the transformer is a class, create a new instance
    if (Transformer && Transformer.prototype instanceof TransformerAbstract) {
      return new Transformer()
    }

    if (typeof Transformer === 'function') {
      // if a closure was passed, we create an anonymous transformer class
      // with the passed closure as transform method
      class ClosureTransformer extends TransformerAbstract {
        transform (data) { return Transformer(data) }
      }
      ClosureTransformer.transform = Transformer

      return new ClosureTransformer()
    }

    throw new Error('A transformer must be a function or a class extending TransformerAbstract')
  }

  /**
   * Resolves a transformer from the ioc container
   *
   * @param {*} Transformer
   */
  _resolveTransformer (transformer) {
    let prefix = ''

    // if the provided transformer name does not start with the App namespace
    // we assume we need to add the prefix to the name
    if (!transformer.startsWith('App')) {
      const Config = ioc.use('Adonis/Src/Config')
      const namespace = _trimEnd(Config.get('bumblebee.namespace', 'App/Transformers'), '/')

      prefix = `${namespace}/`
    }

    // try to load the transformer using the ioc container
    return ioc.use(`${prefix}${transformer}`)
  }

  /**
   * Checks if any variants are defined and calls the corresponding transform method
   *
   * @param {*} transformerInstance
   * @param {*} data
   * @param {*} ctx
   */
  async _dispatchToTransformerVariant (transformerInstance, data, ctx) {
    const variant = this._resource.getVariant()

    //  if a variant was defined, we construct the name for the transform mehod
    // otherwise, the default transformer method 'transform' is called
    const transformMethodName = variant
      ? `transform${variant.charAt(0).toUpperCase()}${variant.slice(1)}`
      : 'transform'

    // Since the user can pass anything as a variant name, we need to
    // validate that the transformer method exists.
    if (!(transformerInstance[transformMethodName] instanceof Function)) {
      throw new Error(`A transformer method '${transformMethodName}' could not be found in '${transformerInstance.constructor.name}'`)
    }

    // now we call the transformer method on the transformer and return the data
    return transformerInstance[transformMethodName](data, this._ctx)
  }

  /**
   * Check if the used transformer has any includes defined
   *
   * @param {*} Transformer
   */
  _transformerHasIncludes (Transformer) {
    const defaultInclude = Transformer.constructor.defaultInclude
    const availableInclude = Transformer.constructor.availableInclude

    return defaultInclude.length > 0 || availableInclude.length > 0
  }

  /**
   * Set the parent scope identifier
   */
  setParentScopes (parentScopes) {
    this._parentScopes = parentScopes
  }

  /**
   *  Returns the parents scope identifier
   */
  getParentScopes () {
    return this._parentScopes
  }

  /**
   * Get the identifier for this scope
   */
  getScopeIdentifier () {
    return this._scopeIdentifier
  }
}

module.exports = Scope
