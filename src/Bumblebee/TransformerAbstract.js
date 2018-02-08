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

    for (let include of this.defaultInclude()) {
      let resource = this.callIncludeFunction(include, data)

      let childScope = new Scope(parentScope._manager, resource, parentScope._ctx)

      includeData[include] = await childScope.toArray()
    }

    return includeData
  }

  callIncludeFunction (include, data) {
    let includeName = `include${include.charAt(0).toUpperCase()}${include.slice(1)}`

    return this[includeName](data)
  }
}

module.exports = TransformerAbstract
