'use strict'

/**
 * SerializerAbstract class
 *
 * @class SerializerAbstract
 */
class SerializerAbstract {
  /**
   * This method must be implemented by a serializer
   *
   * @param {*} data
   */
  async collection (data) {
    throw new Error('A Serializer must implement the method collection')
  }

  /**
   * This method must be implemented by a serializer
   *
   * @param {*} data
   */
  async item (data) {
    throw new Error('A Serializer must implement the method item')
  }

  /**
   * This method must be implemented by a serializer
   */
  async null () {
    throw new Error('A Serializer must implement the method null')
  }

  /**
   * This method must be implemented by a serializer
   *
   * @param {*} meta
   */
  async meta (meta) {
    throw new Error('A Serializer must implement the method meta')
  }

  /**
   * This method must be implemented by a serializer
   *
   * @param {*} meta
   */
  async paginator (meta) {
    throw new Error('A Serializer must implement the method paginator')
  }

  /**
   * This method combines the data from includes with the data from the main transformer.
   *
   * @param {*} data
   * @param {*} includes
   */
  async mergeIncludes (data, includes) {
    return Object.assign(includes, data)
  }
}

module.exports = SerializerAbstract
