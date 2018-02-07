'use strict'

const Manager = require('./Manager')

const Resources = require('./Resources')

class Bumblebee {
  static create (data = null, transformer = null) {
    let instance = new Bumblebee(new Manager())
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer

    return instance
  }

  constructor (manager) {
    this._manager = manager
    return this
  }

  collection (data) {
    this.data('Collection', data)

    return this
  }

  item (data) {
    this.data('Item', data)

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

  toArray () {
    return this.createData().toArray()
  }

  createData () {
    return this._manager.createData(this.getResource())
  }

  getResource () {
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
