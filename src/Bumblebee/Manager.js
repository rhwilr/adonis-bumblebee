'use strict'

const Scope = require('./Scope')

/**
 * Manager class
 *
 * @class Manager
 * @constructor
 */
class Manager {
  createData (resource, ctx = null) {
    return new Scope(this, resource, ctx)
  }
}

module.exports = Manager
