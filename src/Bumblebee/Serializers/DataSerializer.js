'use strict'

const SerializerAbstract = require('./SerializerAbstract')

/**
 * SerializerAbstract class
 *
 * @class SerializerAbstract
 * @constructor
 */
class DataSerializer extends SerializerAbstract {
  async collection (data) {
    return { data: data }
  }

  async item (data) {
    if (data instanceof Object) {
      return { data: data }
    }

    return data
  }

  async null () {
    return null
  }

  async meta (meta) {
    return {meta: meta}
  }
}

module.exports = DataSerializer
