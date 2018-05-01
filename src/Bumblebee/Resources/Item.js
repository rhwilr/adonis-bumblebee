'use strict'

const ResourceAbstract = require('./ResourceAbstract')

/**
 * Collection class
 *
 * @class Collection
 * @extends ResourceAbstract
 */
class Item extends ResourceAbstract {
  /**
   * The Item resource does not support pagination,
   * null is returned
   */
  getPagination () {
    return null
  }
}

module.exports = Item
