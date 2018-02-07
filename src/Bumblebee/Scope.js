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
  constructor (manager, resource) {
    this._manager = manager
    this._resource = resource
  }

  async toArray () {
    if (this._resource instanceof Resources.Collection) {
      return this._collection(this._resource.getData(), this._resource.getTransformer())
    }

    if (this._resource instanceof Resources.Item) {
      return this._item(this._resource.getData(), this._resource.getTransformer())
    }

    return this._resource.getData()
  }

  async _collection (data, transformer) {
    return Promise.all(
      this._getCollectionRows(await data).map((item) => this._item(item, transformer))
    )
  }

  async _item (data, transformer) {
    let transformerInstance = this._getTransformerInstance(transformer)

    let transformed = transformerInstance.transform(await data, this._ctx)

    return transformed
  }

  _getCollectionRows (data) {
    if (data.hasOwnProperty('rows')) {
      return data.rows
    }
    return data
  }

  _getTransformerInstance (Transformer) {
    if (Transformer.prototype instanceof TransformerAbstract) {
      return new Transformer()
    }

    return {transform: Transformer}
  }
}

module.exports = Scope
