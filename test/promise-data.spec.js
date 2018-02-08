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

test.group('Promise Data', (group) => {
  group.before(async () => {
    await setup()
  })

  test('data can be a promis and will resolve before transforming', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = new Promise((resolve, reject) => {
      setTimeout(resolve, 1, {item_id: 3})
    })

    let transformed = await transform
    .item(data, model => ({id: model.item_id}))

    assert.equal(transformed.id, 3)
  })
})
