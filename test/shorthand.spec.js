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

test.group('Shorthand', (group) => {
  group.before(async () => {
    await setup()
  })

  test('transformer can be passed directly to item', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = {item_id: 3}

    let transformed = await transform
      .item(data, model => ({id: model.item_id}))

    assert.equal(transformed.id, 3)
  })

  test('transformer can be passed directly to collection', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = [{item_id: 3}]

    let transformed = await transform
      .collection(data, model => ({id: model.item_id}))

    assert.deepEqual(transformed, [{id: 3}])
  })
})
