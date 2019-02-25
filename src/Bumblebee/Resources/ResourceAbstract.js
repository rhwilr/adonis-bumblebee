'use strict'

/**
 * ResourceAbstract class
 *
 * @class ResourceAbstract
 * @constructor
 */
class ResourceAbstract {
  /**
   * Constractor for the ResourceAbstract
   * This allowes to set data and transformer while creating an instance
   */
  constructor (data, trans) {
    this.data = data
    this.meta = null

    let { transformer, variant } = this._separateTransformerAndVariation(trans)

    this.transformer = transformer
    this.variant = variant
  }

  /**
   * Return the data for this resource
   */
  async getData () {
    // data can be a promise, so we wait until it resolves
    let data = await this.data

    // if data is a lucid collection, return just the array with the data
    if (data && data.rows) {
      return data.rows
    }

    // data is an item, so we return it as is
    return data
  }

  /**
   * Returns the transformer set for this resource
   */
  getTransformer () {
    return this.transformer
  }

  /**
   * Set Meta data that will be included when transforming this resource
   *
   * @param {Object} meta
   */
  setMeta (meta) {
    this.meta = meta

    return this
  }

  /**
   * Returns the metadata
   */
  getMeta () {
    return this.meta
  }

  /**
   * Set pagination information for this resource
   *
   * @param {Object} pagination
   */
  setPagination (pagination) {
    this.pagination = pagination

    return this
  }

  /**
   * Returns the saved pagination information
   */
  getPagination () {
    return this.pagination
  }

  /**
   * Set the transformer variant to be used for this resource
   *
   * @param {Object} pagination
   */
  setVariant (variant) {
    if (variant) {
      this.variant = variant
    }

    return this
  }

  /**
   * Returns the transformer variant
   */
  getVariant () {
    return this.variant
  }

  /**
   * When a transformer string is passed with a variation defined in dot-notation
   * we will split the string into transformer and variant
   */
  _separateTransformerAndVariation (transformerString) {
    // This feature is only available when a string binding is used
    if (typeof transformerString !== 'string') {
      return { transformer: transformerString, variant: null }
    }

    let regex = /(.*)\.(.*)/

    let matches = transformerString.match(regex)

    // if the string did not contain a variation use the
    // transformerString is used and the variation is set to null
    let transformer = matches ? matches[1] : transformerString
    let variant = matches ? matches[2] : null

    return { transformer, variant }
  }
}

module.exports = ResourceAbstract
