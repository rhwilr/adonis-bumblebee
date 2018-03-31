'use strict'

const ResourceAbstract = require('./ResourceAbstract')

/**
 * Null class
 *
 * @class Null
 */
class Null extends ResourceAbstract {
  /**
   * Overwrite the constructor and set data and transformer to null
   */
  constructor () {
    super(null, null)
  }

  /**
   * Returns null, a NullResource always returns null
   */
  getData () {
    return null
  }
}

module.exports = Null
