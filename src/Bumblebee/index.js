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
  constructor (app) {
    this._app = app // The application instance
  }

  collection (data, Transformer) {
    let transformerInstance = new Transformer()

    return data.rows.map(item => transformerInstance.transform(item))
  }
}

module.exports = Bumblebee
