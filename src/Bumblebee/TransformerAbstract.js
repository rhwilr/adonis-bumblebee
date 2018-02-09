'use strict'

const Resources = require('./Resources')

/**
 * TransformerAbstract class
 *
 * @class TransformerAbstract
 * @constructor
 */
class TransformerAbstract {
  /*
   * Resources that can be included if requested
  */
  availableInclude () {
    return []
  }

  /*
   * List of resources to automatically include
  */
  defaultInclude () {
    return []
  }

  /**
   * Implementation required
   */
  transform () {
    throw new Error('You have to implement the method transform!')
  }

  collection (data, transformer) {
    return new Resources.Collection(data, transformer)
  }

  item (data, transformer) {
    return new Resources.Item(data, transformer)
  }

  null () {
    return new Resources.Null()
  }

  async processIncludedResources (parentScope, data) {
    let includeData = {}

    const Scope = require('./Scope')

    for (let include of this.figureOutWhichIncludes(parentScope)) {
      let resource = await this.callIncludeFunction(include, data)

      let childScope = new Scope(parentScope._manager, resource, parentScope._ctx)

      includeData[include] = await childScope.toArray()
    }

    return includeData
  }

  async callIncludeFunction (include, data) {
    let includeName = `include${include.charAt(0).toUpperCase()}${include.slice(1)}`

    return this[includeName](data)
  }

  figureOutWhichIncludes (parentScope) {
    let includes = this.defaultInclude()

    let requestedAvailableIncludes = this.availableInclude().filter(i => parentScope._isRequested(i))

    return includes.concat(requestedAvailableIncludes)
  }
}

module.exports = TransformerAbstract
