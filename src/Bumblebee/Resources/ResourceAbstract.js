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

  async getData () {
    let data = await this.data
    if (data && data.rows) {
      return data.rows
    }

    return data
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
