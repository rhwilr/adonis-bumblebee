'use strict'

/**
 * ResourceAbstract class
 *
 * @class ResourceAbstract
 * @constructor
 */
class ResourceAbstract {
  constructor (data, transformer) {
    this.data = data
    this.transformer = transformer
  }

  getData () {
    return this.data
  }

  getTransformer () {
    return this.transformer
  }
}

module.exports = ResourceAbstract
