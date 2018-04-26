'use strict'

const { ioc } = require('@adonisjs/fold')
const Scope = require('./Scope')
const Serializers = require('./Serializers')

/**
 * Manager class
 *
 * @class Manager
 * @constructor
 */
class Manager {
  constructor () {
    const Config = ioc.use('Adonis/Src/Config')

    this.serializer = null
    this.requestedIncludes = new Set()
    this._recursionLimit = Config.get('bumblebee.includeRecursionLimit', 10)
  }

  createData (resource, ctx = null) {
    this._setIncludesFromRequest(ctx)
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

    includes = includes.map(i => this._guardAgainstToDeepRecursion(i)).map(i => this._formatIncludeName(i))

    includes.forEach(this.requestedIncludes.add, this.requestedIncludes)
    this._autoIncludeParents()
  }

  setSerializer (serializer) {
    if (typeof serializer === 'string') {
      serializer = new Serializers[serializer]()
    }

    this.serializer = serializer
  }

  getSerializer () {
    if (!this.serializer) {
      const Config = ioc.use('Adonis/Src/Config')
      this.setSerializer(Config.get('bumblebee.serializer', 'plain'))
    }

    return this.serializer
  }

  _formatIncludeName (include) {
    // split the include name by recursion level
    return include.split('.')
      .map(fragment => {
        // Split on underscores and hyphens to properly support multi-part includes
        let fragments = fragment.split(/[_|-]/)

        // transform the fist letter of each word into uppercase, except for the first word.
        let camelCaseInclude = fragments.slice(1).map(word => word[0].toUpperCase() + word.substr(1))

        // combine the first word with the rest of the fragments
        return fragments.slice(0, 1).concat(camelCaseInclude).join('')
      })
      .join('.')
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

  _setIncludesFromRequest (ctx) {
    const Config = ioc.use('Adonis/Src/Config')

    // Only parse includes if enabled in config
    if (!Config.get('bumblebee.parseRequest', false)) return

    let params = (ctx && ctx.request.get()) || {}

    if (params.include) {
      this.parseIncludes(params.include)
    }
  }
}

module.exports = Manager
