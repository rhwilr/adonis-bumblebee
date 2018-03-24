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
    this.data('Collection', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  item (data, transformer = null) {
    this.data('Item', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  null () {
    this.data('Null', null)

    return this
  }

  paginate (data, transformer = null) {
    let paginatedData = data.toJSON()
    this.data('Collection', paginatedData.data)

    delete paginatedData.data
    this._pagination = paginatedData

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  data (dataType, data) {
    this._data = data
    this._dataType = dataType

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

  toArray () {
    return this._createData().toArray()
  }

  setializeWith (serializer) {
    return this.setSerializer(serializer)
  }

  setSerializer (serializer) {
    this._manager.setSerializer(serializer)

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
