'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { ioc } = require('@adonisjs/fold')

const setup = require('./setup')

test.group('Providers', group => {
  group.before(async () => {
    await setup()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('BumblebeeProvider', async assert => {
    assert.isDefined(ioc.use('Adonis/Addons/Bumblebee'))
    assert.isFalse(ioc._bindings['Adonis/Addons/Bumblebee'].singleton)
  })

  test('CommandsProvider', async assert => {
    assert.isDefined(ioc.use('Adonis/Commands/Make:Transformer'))
    assert.isFalse(ioc._bindings['Adonis/Commands/Make:Transformer'].singleton)
  })
})
