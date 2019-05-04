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

const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')
const setup = require('./setup')

class IDTransformer extends TransformerAbstract {
  transform (model) {
    return {
      id: model.item_id
    }
  }
}

test.group('IoC', group => {
  group.before(async () => {
    await setup()

    ioc.fake('App/Transformers/IDTransformer', () => IDTransformer)
    ioc.fake('App/APITransformers/IDTransformer', () => IDTransformer)
  })

  test('a transformer can be resolved using its namespace', async (assert) => {
    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith('App/Transformers/IDTransformer')
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('a transformer can use a custom namespace if the fully qualified namespace is used', async (assert) => {
    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith('App/APITransformers/IDTransformer')
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('the default namespace is used if only the transformer name is defined', async (assert) => {
    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith('IDTransformer')
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('an exception is thrown when namespace doesn\'t exists', async (assert) => {
    assert.plan(2)

    let data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith('IDontExists')
        .toJSON()
    } catch (e) {
      assert.include(e.message, 'Cannot find module \'App/Transformers/IDontExists\'')
    }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith('App/Transformers/IDontExists')
        .toJSON()
    } catch (e) {
      assert.include(e.message, 'Cannot find module \'App/Transformers/IDontExists\'')
    }
  })
})
