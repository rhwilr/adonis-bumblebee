'use strict'

/**
 * ResourceAbstract class
 *
 * @class ResourceAbstract
 * @constructor
 */
class ResourceAbstract {
  constructor (data, transformer) {
    this.data = data
    this.transformer = transformer
    this.meta = null
  }

  getData () {
    if (this.data && this.data.toArray instanceof Function) {
      return this.data.toArray()
    }

    return this.data
  }

  getTransformer () {
    return this.transformer
  }

  setMeta (meta) {
    this.meta = meta

    return this
  }

  getMeta (meta) {
    return this.meta
  }
}

module.exports = ResourceAbstract
