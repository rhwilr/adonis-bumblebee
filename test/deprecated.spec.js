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

const Bumblebee = require('../src/Bumblebee')

test.group('Deprecated', () => {
  test('check deprecated methods are still callable', async (assert) => {
    assert.plan(1)
    const originalLog = console.warn

    console.warn = (message) => {
      assert.equal(!!message.match(/(Deprecation warning)(.*)/), true)
    }

    await Bumblebee.create().item({ item_id: 3 }).transformWith(model => ({})).toArray()

    console.warn = originalLog
  })
})
