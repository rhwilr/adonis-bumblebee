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

    if (this.data && this.data.toJSON instanceof Function) {
      let data = this.data.toJSON()
      return data.data || data
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

  getMeta () {
    return this.meta
  }

  setPagination (pagination) {
    this.pagination = pagination

    return this
  }

  getPagination () {
    return this.pagination
  }
}

module.exports = ResourceAbstract
