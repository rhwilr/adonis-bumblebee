'use strict'

const ResourceAbstract = require('./ResourceAbstract')

/**
 * Collection class
 *
 * @class Collection
 */
class Collection extends ResourceAbstract {
  constructor () {
    super(null, null)
  }

  getData () {
    return null
  }
}

module.exports = Collection
