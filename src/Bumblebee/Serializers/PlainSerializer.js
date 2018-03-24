'use strict'

const SerializerAbstract = require('./SerializerAbstract')

/**
 * SerializerAbstract class
 *
 * @class SerializerAbstract
 * @constructor
 */
class PlainSerializer extends SerializerAbstract {
  async collection (data) {
    return data
  }

  async item (data) {
    return data
  }

  async null () {
    return null
  }

  async meta (meta) {
    return {meta: meta}
  }

  async paginator (pagination) {
    return {pagination: pagination}
  }
}

module.exports = PlainSerializer
