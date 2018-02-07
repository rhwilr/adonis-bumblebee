'use strict'

const Scope = require('./Scope')

/**
 * Manager class
 *
 * @class Manager
 * @constructor
 */
class Manager {
  createData (resource) {
    return new Scope(this, resource)
  }
}

module.exports = Manager
