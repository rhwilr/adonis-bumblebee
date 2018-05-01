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
  /**
   * Create a new Manager instance
   */
  constructor () {
    const Config = ioc.use('Adonis/Src/Config')

    this.serializer = null
    this.requestedIncludes = new Set()
    this._recursionLimit = Config.get('bumblebee.includeRecursionLimit', 10)
  }

  /**
   * Create a Scope instance for the resource
   *
   * @param {*} resource
   * @param {*} ctx
   */
  createData (resource, ctx = null) {
    this._setIncludesFromRequest(ctx)
    return new Scope(this, resource, ctx)
  }

  /**
   * Returns the requested includes
   */
  getRequestedIncludes () {
    return this.requestedIncludes
  }

  /**
   * Parses an include string or array and constructs an array of all requested includes
   * @param {*} includes
   */
  parseIncludes (includes) {
    this.requestedIncludes = new Set()

    // if a string is passed, split by comma and return an array
    if (typeof includes === 'string') {
      includes = includes.split(',')
    }

    // if it is not an array, we can not parse it at this point
    if (!Array.isArray(includes)) {
      throw Error(`The parseIncludes() method expects a string or an array. ${typeof includes} given`)
    }

    // sanitize the includes
    includes = includes.map(i => this._guardAgainstToDeepRecursion(i)).map(i => this._formatIncludeName(i))

    // add all includes to the internal set
    includes.forEach(this.requestedIncludes.add, this.requestedIncludes)
    this._autoIncludeParents()
  }

  /**
   * Create a serializer
   *
   * @param {*} serializer
   */
  setSerializer (serializer) {
    if (typeof serializer === 'string') {
      serializer = new Serializers[serializer]()
    }

    this.serializer = serializer
  }

  /**
   * Get an instance if the serializer,
   * if not set, use setting from the config
   */
  getSerializer () {
    if (!this.serializer) {
      const Config = ioc.use('Adonis/Src/Config')
      this.setSerializer(Config.get('bumblebee.serializer', 'plain'))
    }

    return this.serializer
  }

  /**
   * Sanitize the name for the include
   *
   * @param {*} include
   */
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

  /**
   * To prevent to many recursion, we limit the number of nested includes allowed
   *
   * @param {*} include
   */
  _guardAgainstToDeepRecursion (include) {
    return include.split('.').slice(0, this._recursionLimit).join('.')
  }

  /**
   * Add all the resources along the way to a nested include
   */
  _autoIncludeParents () {
    let parsed = []

    // for each resource that is requested
    for (let include of this.requestedIncludes) {
      // we split it by '.' to get the recursions
      let nested = include.split('.')

      // Add the first level to the includes
      let part = nested.shift()
      parsed.push(part)

      // if there are more nesting levels,
      // add each level to the includes
      while (nested.length) {
        part += `.${nested.shift()}`
        parsed.push(part)
      }
    }

    // add all parsed includes to the set of requested includes
    parsed.forEach(this.requestedIncludes.add, this.requestedIncludes)
  }

  /**
   * Allowes setting a custom recursion limit
   *
   * @param {*} limit
   */
  setRecursionLimit (limit) {
    this._recursionLimit = limit

    return this
  }

  /**
   * Parses the request object from the context and extracts the requested includes
   *
   * @param {*} ctx
   */
  _setIncludesFromRequest (ctx) {
    const Config = ioc.use('Adonis/Src/Config')

    // Only parse includes if enabled in config
    if (!Config.get('bumblebee.parseRequest', false)) return

    // get all get parameters from the request
    let params = (ctx && ctx.request.get()) || {}

    // if the 'include' parameter is set, pass it the the parse method
    if (params.include) {
      this.parseIncludes(params.include)
    }
  }
}

module.exports = Manager
