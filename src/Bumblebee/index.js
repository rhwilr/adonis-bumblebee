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
      (await data).rows.map((item) => this.item(item, Transformer))
    )
  }

  async item (data, Transformer) {
    let transformerInstance = new Transformer()

    return transformerInstance.transform(await data, this._ctx)
  }
}

module.exports = Bumblebee
