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

  processIncludedResources (parentScope, data) {
    let includeData = []

    for (let include of this.defaultInclude()) {
      let resource = this.includeAuthor(data.author)

      console.log(data)
      const Scope = require('./Scope')

      let childScope = new Scope(parentScope._manager, resource, parentScope._ctx)

      includeData.push('childScope.toArray()')
      includeData.push(childScope.toArray())
    }

    return includeData
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
}

module.exports = TransformerAbstract
