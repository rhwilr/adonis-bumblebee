'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

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

  async collection (data, Transformer) {
    return Promise.all(
      this._getCollectionRows(await data).map((item) => this.item(item, Transformer))
    )
  }

  async item (data, Transformer) {
    let transformerInstance = new Transformer()

    return transformerInstance.transform(await data, this._ctx)
  }

  _getCollectionRows (data) {
    if (data.hasOwnProperty('rows')) {
      return data.rows
    }
    return data
  }
}

module.exports = Bumblebee
