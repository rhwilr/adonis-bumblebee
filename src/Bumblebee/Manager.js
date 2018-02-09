'use strict'

const Scope = require('./Scope')

/**
 * Manager class
 *
 * @class Manager
 * @constructor
 */
class Manager {
  constructor () {
    this.requestedIncludes = []
  }

  createData (resource, ctx = null) {
    return new Scope(this, resource, ctx)
  }

  getRequestedIncludes () {
    return this.requestedIncludes
  }

  parseIncludes (include) {
    if (typeof include === 'string') {
      this.requestedIncludes.push(include)
    }
    if (Array.isArray(include)) {
      this.requestedIncludes.push(...include)
    }
  }
}

module.exports = Manager
