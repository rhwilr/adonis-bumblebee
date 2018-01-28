'use strict'

/**
 * TransformerAbstract class
 *
 * @namespace Adonis/Addons/TransformerAbstract
 *
 * @class TransformerAbstract
 * @constructor
 */
class TransformerAbstract {
  /**
   * Implementation required
   */
  transform () {
    throw new Error('You have to implement the method transform!')
  }
}

module.exports = TransformerAbstract
