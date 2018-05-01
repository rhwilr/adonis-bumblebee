'use strict'

const Manager = require('./Manager')
const Resources = require('./Resources')

/**
 * Bumblebee class
 *
 * @class Bumblebee
 * @constructor
 */
class Bumblebee {
  /**
   * This static method allow creating a bumblebee instance without having to instantiate is yourself
   * Data and Transformer can be passed optionally
   *
   * @param {*} data
   * @param {TransformerAbstract} transformer
   */
  static create (data = null, transformer = null) {
    // create an instance of Bumblebee and pass a new instance of Manager
    let instance = new Bumblebee(new Manager())

    // initialize data and transformer properties
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer

    // set pagination, context and meta properties to null
    instance._pagination = null
    instance._context = null
    instance._meta = null

    // return the instance for the fluid interface
    return instance
  }

  /**
   * Create a new instance of Bumblebee
   * @param {Manager} manager
   */
  constructor (manager) {
    this._manager = manager
    return this
  }

  /**
   * Pass an array of objects that should be transformed as collection.
   * Optionally a transformer can be passed which will be immediately used to transform the data
   *
   * @param {*} data
   * @param {*} transformer
   */
  collection (data, transformer = null) {
    this._setData('Collection', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  /**
   * Pass an objects that should be transformed as a single item.
   * Optionally a transformer can be passed which will be immediately used to transform the data
   *
   * @param {*} data
   * @param {*} transformer
   */
  item (data, transformer = null) {
    this._setData('Item', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  /**
   * Sets the data to null.
   *
   * @param {*} data
   * @param {*} transformer
   */
  null () {
    this._setData('Null', null)

    return this
  }

  /**
   * Similar to collection but will also try to extract pagination data from a lucid model and add it to the response.
   * Optionally a transformer can be passed which will be immediately used to transform the data
   *
   * @param {*} data
   * @param {*} transformer
   */
  paginate (data, transformer = null) {
    this._setData('Collection', data.rows)

    // extract pagination data
    let paginationData = data.pages

    // ensure the pagination keys are integers
    Object.keys(paginationData).forEach((key) => {
      paginationData[key] = parseInt(paginationData[key])
    })

    // set pagination data
    this._pagination = paginationData

    if (transformer) {
      this.transformWith(transformer)
      return this.toArray()
    }

    return this
  }

  /**
   * Set meta data that will be appended to the transformed result
   *
   * @param {*} meta
   */
  meta (meta) {
    this._meta = meta

    return this
  }

  /**
   * Set the transformer that will be used to transform the data
   *
   * @param {*} meta
   */
  transformWith (transformer) {
    this._transformer = transformer

    return this
  }

  /**
   * Allows setting the context manually that will be passed into to transform methods
   *
   * @param {*} meta
   */
  withContext (ctx) {
    this._ctx = ctx

    return this
  }

  /**
   * Set includes that will be added to the transformed result
   *
   * @param {*} meta
   */
  include (include) {
    this._manager.parseIncludes(include)

    return this
  }

  /**
   * Allows setting the serializer
   * If not set, the default serializer from the config file will be used
   *
   * @param {*} meta
   */
  setSerializer (serializer) {
    this._manager.setSerializer(serializer)

    return this
  }

  /**
   * Alias for setting the serializer
   *
   * @param {*} meta
   */
  serializeWith (serializer) {
    return this.setSerializer(serializer)
  }

  /**
   * Terminate the chain and return the transformed result
   *
   * @param {*} meta
   */
  toArray () {
    return this._createData().toArray()
  }

  /**
   * Set the data
   *
   * @param {*} dataType
   * @param {*} data
   */
  _setData (dataType, data) {
    this._data = data
    this._dataType = dataType
    this._pagination = null

    return this
  }

  /**
   * Helper function to set resource on the manager
   */
  _createData () {
    return this._manager.createData(this._getResource(), this._ctx)
  }

  /**
   * Create a resource for the data and set meta and pagination data
   */
  _getResource () {
    let Resource = Resources[this._dataType]
    let resourceInstance = new Resource(this._data, this._transformer)

    resourceInstance.setMeta(this._meta)
    resourceInstance.setPagination(this._pagination)

    return resourceInstance
  }

  /**
   * Determine resource type based on the type of the data passed
   *
   * @param {*} data
   */
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
