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
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class IDTransformer extends TransformerAbstract {
  transform (model) {
    return {
      id: model.item_id
    }
  }
}

test.group('Transformer', () => {
  test('a transformer maps item properties', async (assert) => {
    let data = {item_id: 3}

    let transformed = await Bumblebee.create()
    .item(data)
    .transformWith(IDTransformer)
    .toArray()

    assert.equal(transformed.id, 3)
  })

  test('a transformer can transform a collection of items', async (assert) => {
    let data = [{item_id: 3}, {item_id: 55}]

    let transformed = await Bumblebee.create()
    .collection(data)
    .transformWith(IDTransformer)
    .toArray()

    assert.deepEqual(transformed, [{id: 3}, {id: 55}])
  })

  test('a transformer can transform a collection of lucid rows', async (assert) => {
    let data = {rows: [{item_id: 3}, {item_id: 55}]}

    let transformed = await Bumblebee.create()
    .collection(data)
    .transformWith(IDTransformer)
    .toArray()

    assert.deepEqual(transformed, [{id: 3}, {id: 55}])
  })

  test('a transformer must implement the transform method', async (assert) => {
    assert.plan(1)
    class InvalidTransformer extends TransformerAbstract {}
    let data = {item_id: 3}

    try {
      await Bumblebee.create()
      .item(data)
      .transformWith(InvalidTransformer)
      .toArray()
    } catch (error) {
      assert.equal(error.message, 'You have to implement the method transform!')
    }
  })

  test('a transformer can be a function', async (assert) => {
    let data = {item_id: 3}

    let transformed = await Bumblebee.create()
    .item(data)
    .transformWith(model => ({
      id: model.item_id
    }))
    .toArray()

    assert.equal(transformed.id, 3)
  })

  test('the null transformer returns always null', async (assert) => {
    let transformed = await Bumblebee.create()
    .null()
    .toArray()

    assert.equal(transformed, null)
  })

  test('data and transformer can be passed to create directly', async (assert) => {
    let item = {item_id: 3}

    let transformedItem = await Bumblebee.create(item, IDTransformer).toArray()
    assert.equal(transformedItem.id, 3)

    let collection = [{item_id: 3}, {item_id: 55}]

    let transformedCollection = await Bumblebee.create(collection, IDTransformer).toArray()
    assert.deepEqual(transformedCollection, [{id: 3}, {id: 55}])

    let transformedNull = await Bumblebee.create(null, IDTransformer).toArray()
    assert.deepEqual(transformedNull, null)
  })
})
