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
    // create an instance of Bumblebee and pass a new instance of Manager
    const instance = new Bumblebee(new Manager())

    // initialize data and transformer properties
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer
    instance._variant = null

    // set pagination, context and meta properties to null
    instance._pagination = null
    instance._context = null
    instance._meta = null

    // return the instance for the fluid interface
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
      return this.toJSON()
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
      return this.toJSON()
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
    this._setData('Collection', data.rows)

    // extract pagination data
    const paginationData = data.pages

    // ensure the pagination keys are integers
    Object.keys(paginationData).forEach((key) => {
      paginationData[key] = parseInt(paginationData[key])
    })

    // set pagination data
    this._pagination = paginationData

    if (transformer) {
      this.transformWith(transformer)
      return this.toJSON()
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
   * Set the transformer variant
   *
   * @param {String} variant
   */
  usingVariant (variant) {
    this._variant = variant

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
    console.warn('Deprecation warning: Calling #toArray() is deprecated. Please us #toJSON() instead.')
    return this.toJSON()
  }

  /**
   * Terminates the fluid interface and returns the transformed data.
   */
  toJSON () {
    return this._createData().toJSON()
  }

  /**
   * @param {String} dataType
   * @param {Object} data
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
    const Resource = Resources[this._dataType]
    const resourceInstance = new Resource(this._data, this._transformer)

    resourceInstance.setMeta(this._meta)
    resourceInstance.setPagination(this._pagination)
    resourceInstance.setVariant(this._variant)

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
