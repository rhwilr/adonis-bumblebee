'use strict'

const TransformerAbstract = require('./TransformerAbstract')
const Resources = require('./Resources')

/**
 * Bumblebee class
 *
 * @namespace Adonis/Addons/Bumblebee
 * @singleton
 * @alias Bumblebee
 *
 * @class Bumblebee
 * @constructor
 */
class Scope {
  constructor (manager, resource, ctx, scopeIdentifier = null) {
    this._manager = manager
    this._resource = resource
    this._ctx = ctx
    this._scopeIdentifier = scopeIdentifier
    this._parentScopes = []
  }

  async toArray () {
    let [rawData] = await this._executeResourceTransformers()

    let serializer = this._manager.getSerializer()

    let data = await this._serializeResource(serializer, rawData)

    let meta = {}

    if (this._resource instanceof Resources.Collection && this._resource.getPagination()) {
      let pagination = await serializer.paginator(this._resource.getPagination())
      meta = Object.assign(pagination, meta)
    }

    if (this._resource.getMeta()) {
      meta = await serializer.meta(this._resource.getMeta())
    }

    if (Object.keys(meta).length !== 0) {
      if (Array.isArray(data) || (typeof data !== 'object' && data !== null)) {
        data = {data: data}
      }

      data = Object.assign(meta, data)
    }

    return data
  }

  async _executeResourceTransformers () {
    let transformer = this._resource.getTransformer()
    let data = await this._resource.getData()

    let transformedData = []
    let includedData = []

    if (!data || this._resource instanceof Resources.Null) {
      transformedData = null
      includedData = []
    } else if (this._resource instanceof Resources.Item) {
      [transformedData, includedData] = await this._fireTransformer(data, transformer)
    } else if (this._resource instanceof Resources.Collection) {
      for (let value of data) {
        let [transformedValue, includedValue] = await this._fireTransformer(value, transformer)

        transformedData.push(transformedValue)
        includedData.push(includedValue)
      }
    } else {
      throw new Error('This resourcetype is not supported. Use Item or Collection')
    }

    return [transformedData, includedData]
  }

  async _fireTransformer (data, transformer) {
    let includedData = []

    // get a transformer instance and tranform data
    let transformerInstance = this._getTransformerInstance(transformer)
    let transformedData = await transformerInstance.transform(await data, this._ctx)

    if (this._transformerHasIncludes(transformerInstance)) {
      includedData = await transformerInstance.processIncludedResources(this, await data)
      transformedData = await this._manager.getSerializer().mergeIncludes(transformedData, includedData)
    }

    return [transformedData, includedData]
  }

  async _serializeResource (serializer, rawData) {
    if (this._resource instanceof Resources.Collection) {
      return serializer.collection(rawData)
    }

    if (this._resource instanceof Resources.Item) {
      return serializer.item(rawData)
    }

    return serializer.null()
  }

  _isRequested (checkScopeSegment) {
    let scopeArray

    if (this._scopeIdentifier) {
      scopeArray = [...this._parentScopes, this._scopeIdentifier, checkScopeSegment]
    } else {
      scopeArray = [checkScopeSegment]
    }

    let scopeString = scopeArray.join('.')

    return this._manager.getRequestedIncludes().has(scopeString)
  }

  _getTransformerInstance (Transformer) {
    if (Transformer.prototype instanceof TransformerAbstract) {
      return new Transformer()
    }

    class ClosureTransformer extends TransformerAbstract {
      transform (data) { return Transformer(data) }
    }
    ClosureTransformer.transform = Transformer

    return new ClosureTransformer()
  }

  _transformerHasIncludes (Transformer) {
    let defaultInclude = Transformer.defaultInclude()
    let availableInclude = Transformer.availableInclude()

    return defaultInclude.length > 0 || availableInclude.length > 0
  }

  setParentScopes (parentScopes) {
    this._parentScopes = parentScopes
  }

  getParentScopes () {
    return this._parentScopes
  }

  getScopeIdentifier () {
    return this._scopeIdentifier
  }
}

module.exports = Scope
