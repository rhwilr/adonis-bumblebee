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
    return Object.assign(includes, data)
  }
}

module.exports = SerializerAbstract
