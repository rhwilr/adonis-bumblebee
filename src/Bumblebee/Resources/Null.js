'use strict'

const ResourceAbstract = require('./ResourceAbstract')

/**
 * Collection class
 *
 * @class Collection
 * @extends ResourceAbstract
 */
class Null extends ResourceAbstract {
  /**
   * The Null resource does not support Data or Transformers
   */
  constructor () {
    super(null, null)
  }

  /**
   * The Null resource does not support data,
   * null is returned
   */
  getData () {
    return null
  }
}

module.exports = Null
