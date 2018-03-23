'use strict'

const SerializerAbstract = require('./SerializerAbstract')

/**
 * SerializerAbstract class
 *
 * @class SerializerAbstract
 * @constructor
 */
class ArraySerializer extends SerializerAbstract {
  async collection (data) {
    return data
  }

  async item (data) {
    return data
  }

  async null () {
    return null
  }
}

module.exports = ArraySerializer
