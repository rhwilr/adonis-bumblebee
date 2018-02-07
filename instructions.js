'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')

module.exports = async (cli) => {
  try {
    await cli.copy(
      path.join(__dirname, './examples/config.js'),
      path.join(cli.helpers.configPath(), 'bumblebee.js')
    )
    await cli.command.completed('create', 'config/bumblebee.js')
  } catch (error) {
    // ignore error
  }
}
