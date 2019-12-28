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

class PrimitiveTransformer extends TransformerAbstract {
  transform (model) {
    return model.name
  }
}

test.group('Transformer', () => {
  test('a transformer maps item properties', async (assert) => {
    const data = { item_id: 3 }

    const transformed = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('a transformer can transform a collection of items', async (assert) => {
    const data = [{ item_id: 3 }, { item_id: 55 }]

    const transformed = await Bumblebee.create()
      .collection(data)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, [{ id: 3 }, { id: 55 }])
  })

  test('a transformer can return an array', async (assert) => {
    const data = [{ name: 'John' }, { name: 'Bob' }]

    const transformed = await Bumblebee.create()
      .collection(data)
      .transformWith(PrimitiveTransformer)
      .toJSON()

    assert.deepEqual(transformed, ['John', 'Bob'])
  })

  test('a transformer must implement the transform method', async (assert) => {
    assert.plan(1)
    class InvalidTransformer extends TransformerAbstract {}
    const data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith(InvalidTransformer)
        .toJSON()
    } catch ({ message }) {
      assert.equal(message, 'You have to implement the method transform or specify a variant when calling the transformer!')
    }
  })

  test('a transformer can be a function', async (assert) => {
    const data = { item_id: 3 }

    const transformed = await Bumblebee.create()
      .item(data)
      .transformWith(model => ({
        id: model.item_id
      }))
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('an invalid transformer throws an error', async (assert) => {
    assert.plan(2)
    const data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith({})
        .toJSON()
    } catch ({ message }) {
      assert.equal(message, 'A transformer must be a function or a class extending TransformerAbstract')
    }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith(undefined)
        .toJSON()
    } catch ({ message }) {
      assert.equal(message, 'A transformer must be a function or a class extending TransformerAbstract')
    }
  })

  test('the null transformer returns always null', async (assert) => {
    const transformed = await Bumblebee.create()
      .null()
      .toJSON()

    assert.equal(transformed, null)
  })

  test('if null is passed to item transformer, null is returned', async (assert) => {
    const transformed = await Bumblebee.create()
      .item(null)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, null)
  })

  test('if null is passed to collection transformer, null is returned', async (assert) => {
    const transformed = await Bumblebee.create()
      .collection(null)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, null)
  })

  test('data and transformer can be passed to create method directly', async (assert) => {
    const item = { item_id: 3 }

    const transformedItem = await Bumblebee.create(item, IDTransformer).toJSON()
    assert.equal(transformedItem.id, 3)

    const collection = [{ item_id: 3 }, { item_id: 55 }]

    const transformedCollection = await Bumblebee.create(collection, IDTransformer).toJSON()
    assert.deepEqual(transformedCollection, [{ id: 3 }, { id: 55 }])

    const transformedNull = await Bumblebee.create(null, IDTransformer).toJSON()
    assert.deepEqual(transformedNull, null)
  })
})
