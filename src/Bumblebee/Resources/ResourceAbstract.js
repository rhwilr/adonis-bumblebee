'use strict'

/**
 * ResourceAbstract class
 *
 * @class ResourceAbstract
 * @constructor
 */
class ResourceAbstract {
  /**
   * Constractor for the ResourceAbstract
   * This allowes to set data and transformer while creating an instance
   */
  constructor (data, transformer) {
    this.data = data
    this.transformer = transformer
    this.meta = null
  }

  /**
   * Return the data for the resource
   */
  async getData () {
    // data can be a promise, so we wait until it resolves
    let data = await this.data

    // if data is a lucid collection, return just the array with the data
    if (data && data.rows) {
      return data.rows
    }

    // data is an item, so we return it as is
    return data
  }

  /**
   * Returns the transformer for this resource
   */
  getTransformer () {
    return this.transformer
  }

  /**
   * Allows setting custom meta data for this resource
   *
   * @param {*} meta
   */
  setMeta (meta) {
    this.meta = meta

    return this
  }

  /**
   * Returns the meta data for this resource
   */
  getMeta () {
    return this.meta
  }

  /**
   * Allows setting pagination data for this resource
   *
   * @param {*} pagination
   */
  setPagination (pagination) {
    this.pagination = pagination

    return this
  }

  /**
   * Returns the pagination data for this resource
   */
  getPagination () {
    return this.pagination
  }
}

module.exports = ResourceAbstract
