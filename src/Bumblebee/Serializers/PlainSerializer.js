'use strict'

const SerializerAbstract = require('./SerializerAbstract')

/**
 * PlainSerializer class
 *
 * @class PlainSerializer
 * @extends SerializerAbstract
 */
class PlainSerializer extends SerializerAbstract {
  /**
   * Returns the data array for a collection
   *
   * @param {*} data
   */
  async collection (data) {
    return data
  }

  /**
   * Returns the data object for an item
   *
   * @param {*} data
   */
  async item (data) {
    return data
  }

  /**
   * Will always return null
   */
  async null () {
    return null
  }

  /**
   * Meta data is set on the meta property for the item
   *
   * @param {*} meta
   */
  async meta (meta) {
    return {meta: meta}
  }

  /**
   * Pagination data is set on the pagination property on the item
   *
   * @param {*} pagination
   */
  async paginator (pagination) {
    return {pagination: pagination}
  }
}

module.exports = PlainSerializer
