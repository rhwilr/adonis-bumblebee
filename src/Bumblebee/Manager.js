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
    this.requestedIncludes = new Set()
    this._recursionLimit = 10
  }

  createData (resource, ctx = null) {
    return new Scope(this, resource, ctx)
  }

  getRequestedIncludes () {
    return this.requestedIncludes
  }

  parseIncludes (includes) {
    this.requestedIncludes = new Set()

    if (typeof includes === 'string') {
      includes = includes.split(',')
    }
    if (!Array.isArray(includes)) {
      throw Error(`The parseIncludes() method expects a string or an array. ${typeof includes} given`)
    }

    includes = includes.map(i => this._guardAgainstToDeepRecursion(i))

    includes.forEach(this.requestedIncludes.add, this.requestedIncludes)
    this._autoIncludeParents()
  }

  _guardAgainstToDeepRecursion (include) {
    return include.split('.').slice(0, this._recursionLimit).join('.')
  }

  _autoIncludeParents () {
    let parsed = []

    for (let include of this.requestedIncludes) {
      let nested = include.split('.')

      let part = nested.shift()
      parsed.push(part)

      while (nested.length) {
        part += `.${nested.shift()}`
        parsed.push(part)
      }
    }
    parsed.forEach(this.requestedIncludes.add, this.requestedIncludes)
  }

  setRecursionLimit (limit) {
    this._recursionLimit = limit

    return this
  }
}

module.exports = Manager
