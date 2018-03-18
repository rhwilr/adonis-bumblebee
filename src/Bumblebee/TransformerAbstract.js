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

    let resourcesToInclude = this.figureOutWhichIncludes(parentScope)

    await this.eagerloadIncludedResource(resourcesToInclude, data)

    for (let include of resourcesToInclude) {
      let resource = await this.callIncludeFunction(include, data)

      if (resource instanceof Resources.ResourceAbstract) {
        includeData[include] = await this.createChildScopeFor(parentScope, resource, include).toArray()
      } else {
        includeData[include] = resource
      }
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

  createChildScopeFor (parentScope, resource, include) {
    const Scope = require('./Scope')

    let childScope = new Scope(parentScope._manager, resource, parentScope._ctx, include)

    let scopeArray = [...parentScope.getParentScopes()]

    if (parentScope.getScopeIdentifier()) {
      scopeArray.push(parentScope.getScopeIdentifier())
    }

    childScope.setParentScopes(scopeArray)

    return childScope
  }

  async eagerloadIncludedResource (resourcesToInclude, data) {
    if (!data.loadMany) return

    let resourcesToLoad = resourcesToInclude.filter(resource => data[resource] instanceof Function)

    await data.loadMany(resourcesToLoad)
  }
}

module.exports = TransformerAbstract
