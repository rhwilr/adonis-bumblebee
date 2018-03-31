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
   * Creates a new instance of Bumblebee
   * Data and transformer can optionally be passed or set via setters in the instance.
   *
   * @param {*} data
   * @param {TransformerAbstract} transformer
   */
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

  /**
   * Create a new Bumblebee instance.
   * An instance of Manager has to be passed
   *
   * @param {Manager} manager
   */
  constructor (manager) {
    this._manager = manager
    return this
  }

  /**
   * Add a collection of data to be transformed.
   * If a transformer is passed, the fluid interface is terminated
   *
   * @param {Array} data
   * @param {TransformerAbstract} transformer
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
   * Add data that should be transformed as a single item.
   * If a transformer is passed, the fluid interface is terminated
   *
   * @param {Array} data
   * @param {TransformerAbstract} transformer
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
   * Sets data to null
   */
  null () {
    this._setData('Null', null)

    return this
  }

  /**
   * Add a collection of data to be transformed.
   * Works just like collection but requires data to be a lucid paginated model.
   * If a transformer is passed, the fluid interface is terminated
   *
   * @param {Array} data
   * @param {TransformerAbstract} transformer
   */
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

  /**
   * Add additional meta data to the object under transformation
   *
   * @param {Object} meta
   */
  meta (meta) {
    this._meta = meta

    return this
  }

  /**
   * Set the transformer
   *
   * @param {TransformerAbstract} transformer
   */
  transformWith (transformer) {
    this._transformer = transformer

    return this
  }

  /**
   * Allows you to set the adonis context if you are not
   * using the 'transform' object from the http context.
   *
   * @param {Context} ctx
   */
  withContext (ctx) {
    this._ctx = ctx

    return this
  }

  /**
   * Additional resources that should be included and that are defined as
   * 'availableInclude' on the transformer.
   *
   * @param {Array, String} include
   */
  include (include) {
    this._manager.parseIncludes(include)

    return this
  }

  /**
   * Set the serializer for this transformation.
   *
   * @param {SerializerAbstrace} serializer
   */
  setSerializer (serializer) {
    this._manager.setSerializer(serializer)

    return this
  }

  /**
   * Alias for 'setSerializer'
   *
   * @param {SerializerAbstrace} serializer
   */
  serializeWith (serializer) {
    return this.setSerializer(serializer)
  }

  /**
   * Terminates the fluid interface and returns the transformed data.
   */
  toArray () {
    return this._createData().toArray()
  }

  /**
   * @param {String} dataType
   * @param {Object} data
   */
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
