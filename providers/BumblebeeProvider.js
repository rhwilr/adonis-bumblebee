'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')
const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class BumblebeeProvider extends ServiceProvider {
  /**
   * Register all the required providers
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.bind('Adonis/Addons/Bumblebee/TransformerAbstract', app => {
      return TransformerAbstract
    })

    this.app.bind('Adonis/Addons/Bumblebee', app => {
      return Bumblebee
    })

    this.app.alias('Adonis/Addons/Bumblebee/TransformerAbstract', 'BaseTransformer')
  }

  /**
   * Bind ally to the http context
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Context = this.app.use('Adonis/Src/HttpContext')

    Context.getter('transform', function () {
      return Bumblebee.create().withContext(this)
    }, true)
  }
}

module.exports = BumblebeeProvider
