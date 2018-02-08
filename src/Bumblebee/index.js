'use strict'

const Manager = require('./Manager')

const Resources = require('./Resources')

class Bumblebee {
  static create (data = null, transformer = null) {
    let instance = new Bumblebee(new Manager())
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer
    instance._context = null

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

  data (dataType, data) {
    this._data = data
    this._dataType = dataType

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

  toArray () {
    return this._createData().toArray()
  }

  _createData () {
    return this._manager.createData(this._getResource(), this._ctx)
  }

  _getResource () {
    let Resource = Resources[this._dataType]
    return new Resource(this._data, this._transformer)
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
