'use strict'

/**
 * TransformerAbstract class
 *
 * @class TransformerAbstract
 * @constructor
 */
class TransformerAbstract {
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
}

module.exports = TransformerAbstract
