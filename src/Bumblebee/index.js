'use strict'

const Manager = require('./Manager')

const Resources = require('./Resources')

class Bumblebee {
  static create (data = null, transformer = null) {
    let instance = new Bumblebee(new Manager())
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer
    instance._pagination = null
    instance._context = null
    instance._meta = null

    return instance
  }

  constructor (manager) {
    this._manager = manager
    return this
  }

  collection (data, transformer = null) {
    this._setData('Collection', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  item (data, transformer = null) {
    this._setData('Item', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  null () {
    this._setData('Null', null)

    return this
  }

  paginate (data, transformer = null) {
    if (!(data.toJSON instanceof Function)) {
      throw new Error('The paginate() method only accepts query builder results with pagination.')
    }

    let paginatedData = data.toJSON()
    this._setData('Collection', paginatedData.data)

    delete paginatedData.data
    this._pagination = paginatedData

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  meta (meta) {
    this._meta = meta

    return this
  }

  transformWith (transformer) {
    this._transformer = transformer

    return this
  }

  withContext (ctx) {
    this._ctx = ctx

    return this
  }

  include (include) {
    this._manager.parseIncludes(include)

    return this
  }

  setSerializer (serializer) {
    this._manager.setSerializer(serializer)

    return this
  }

  serializeWith (serializer) {
    return this.setSerializer(serializer)
  }

  toArray () {
    return this._createData().toArray()
  }

  _setData (dataType, data) {
    this._data = data
    this._dataType = dataType

    return this
  }

  _createData () {
    return this._manager.createData(this._getResource(), this._ctx)
  }

  _getResource () {
    let Resource = Resources[this._dataType]
    let resourceInstance = new Resource(this._data, this._transformer)

    resourceInstance.setMeta(this._meta)
    resourceInstance.setPagination(this._pagination)

    return resourceInstance
  }

  _determineDataType (data) {
    if (data === null) {
      return 'Null'
    }

    if (Array.isArray(data)) {
      return 'Collection'
    }

    return 'Item'
  }
}

module.exports = Bumblebee
