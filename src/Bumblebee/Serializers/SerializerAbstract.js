'use strict'

/**
 * SerializerAbstract class
 *
 * @class SerializerAbstract
 * @constructor
 */
class SerializerAbstract {
  async collection (data) {
    throw new Error('A Serializer must implement the method collection')
  }

  async item (data) {
    throw new Error('A Serializer must implement the method item')
  }

  async null () {
    throw new Error('A Serializer must implement the method null')
  }

  async meta (meta) {
    throw new Error('A Serializer must implement the method meta')
  }

  async mergeIncludes (data, includes) {
    if (data instanceof Array) {
      return data.concat(includes)
    }

    if (includes instanceof Array) {
      return Object.assign(data, ...includes)
    }

    return Object.assign(data, includes)
  }
}

module.exports = SerializerAbstract
