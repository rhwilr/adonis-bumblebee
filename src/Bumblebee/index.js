'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const TransformerAbstract = require('./TransformerAbstract')

/**
 * Bumblebee class
 *
 * @namespace Adonis/Addons/Bumblebee
 * @singleton
 * @alias Bumblebee
 *
 * @class Bumblebee
 * @constructor
 */
class Bumblebee {
  constructor (ctx) {
    this._ctx = ctx
  }

  async collection (data, transformer) {
    return Promise.all(
      this._getCollectionRows(await data).map((item) => this.item(item, transformer))
    )
  }

  async item (data, transformer) {
    let transformerInstance = this._getTransformerInstance(transformer)

    return transformerInstance.transform(await data, this._ctx)
  }

  _getCollectionRows (data) {
    if (data.hasOwnProperty('rows')) {
      return data.rows
    }
    return data
  }

  _getTransformerInstance (Transformer) {
    if (Transformer.prototype instanceof TransformerAbstract) {
      return new Transformer()
    }

    return {transform: Transformer}
  }
}

module.exports = Bumblebee
