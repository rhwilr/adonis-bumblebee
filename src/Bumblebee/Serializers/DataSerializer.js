'use strict'

const SerializerAbstract = require('./SerializerAbstract')

/**
 * DataSerializer class
 *
 * @class DataSerializer
 * @extends SerializerAbstract
 */
class DataSerializer extends SerializerAbstract {
  /**
   * Returns the data array for a collection, nested under a data property
   *
   * @param {*} data
   */
  async collection (data) {
    return { data: data }
  }

  /**
   * Returns the data object for an item, nested under a data property
   *
   * @param {*} data
   */
  async item (data) {
    // if the item is an object, add it to the data property
    if (data instanceof Object) {
      return { data: data }
    }

    // otherwise, the data is a primitive value which we will just return as is
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

module.exports = DataSerializer
