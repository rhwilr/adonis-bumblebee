'use strict'

const { ioc } = require('@adonisjs/fold')

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
    let [rawData] = await this._executeResourceTransformers()

    // create a serializer instance
    let serializer = this._manager.getSerializer()

    // run the raw data through the serializer
    let data = await this._serializeResource(serializer, rawData)

    // initialize an empty meta object
    let meta = {}

    // if the resource is a collection and there is pagination data...
    if (this._resource instanceof Resources.Collection && this._resource.getPagination()) {
      // run the pagination data through the serializer and add it to the meta object
      let pagination = await serializer.paginator(this._resource.getPagination())
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
    let transformer = this._resource.getTransformer()
    let data = await this._resource.getData()

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
      for (let value of data) {
        let [transformedValue, includedValue] = await this._fireTransformer(value, transformer)

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
    let transformerInstance = this._getTransformerInstance(transformer)
    let transformedData = await transformerInstance.transform(await data, this._ctx)

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

    let scopeString = scopeArray.join('.')

    // check if this include was requested
    return this._manager.getRequestedIncludes().has(scopeString)
  }

  /**
   * Creates and returns a new transformer instance
   *
   * @param {*} Transformer
   */
  _getTransformerInstance (Transformer) {
    // if the transformer is a string, use the IoC to fetch the instance.
    if (typeof Transformer === 'string') {
      return ioc.use(Transformer)
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
   * Check if the used transformer has any includes defined
   *
   * @param {*} Transformer
   */
  _transformerHasIncludes (Transformer) {
    let defaultInclude = Transformer.constructor.defaultInclude
    let availableInclude = Transformer.constructor.availableInclude

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
