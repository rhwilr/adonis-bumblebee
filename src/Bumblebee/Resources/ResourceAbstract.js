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

  /**
   * Return the data for this resource
   */
  async getData () {
    let data = await this.data
    if (data && data.rows) {
      return data.rows
    }

    return data
  }

  /**
   * Returns the transformer set for this resource
   */
  getTransformer () {
    return this.transformer
  }

  /**
   * Set Meta data that will be included when transforming this resource
   *
   * @param {Object} meta
   */
  setMeta (meta) {
    this.meta = meta

    return this
  }

  /**
   * Returns the metadata
   */
  getMeta () {
    return this.meta
  }

  /**
   * Set pagination information for this resource
   *
   * @param {Object} pagination
   */
  setPagination (pagination) {
    this.pagination = pagination

    return this
  }

  /**
   * Returns the saved pagination information
   */
  getPagination () {
    return this.pagination
  }
}

module.exports = ResourceAbstract
