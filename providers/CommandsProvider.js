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

class CommandsProvider extends ServiceProvider {
  /**
   * Register command bindings
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.bind('Adonis/Commands/Make:Transformer', () => require('../src/Commands/MakeTransformer'))
  }

  /**
   * Add commands to Ace
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Make:Transformer')
  }
}

module.exports = CommandsProvider
