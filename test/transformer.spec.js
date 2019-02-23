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
  test('a transformer can be resolved using its namespace', async (assert) => {
    ioc.bind('App/Transformers/IDTransformer', () => IDTransformer)

    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith('App/Transformers/IDTransformer')
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('an exception is thrown when namespace doesn\'t exists', async (assert) => {
    assert.plan(1)

    let data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith('IDontExists')
        .toJSON()
    } catch (e) {
      assert.equal(e.message, 'Cannot find module \'IDontExists\'')
    }
  })

  test('a transformer maps item properties', async (assert) => {
    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('a transformer can transform a collection of items', async (assert) => {
    let data = [{ item_id: 3 }, { item_id: 55 }]

    let transformed = await Bumblebee.create()
      .collection(data)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, [{ id: 3 }, { id: 55 }])
  })

  test('a transformer can return an array', async (assert) => {
    let data = [{ name: 'John' }, { name: 'Bob' }]

    let transformed = await Bumblebee.create()
      .collection(data)
      .transformWith(PrimitiveTransformer)
      .toJSON()

    assert.deepEqual(transformed, ['John', 'Bob'])
  })

  test('a transformer must implement the transform method', async (assert) => {
    assert.plan(1)
    class InvalidTransformer extends TransformerAbstract {}
    let data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith(InvalidTransformer)
        .toJSON()
    } catch ({ message }) {
      assert.equal(message, 'You have to implement the method transform!')
    }
  })

  test('a transformer can be a function', async (assert) => {
    let data = { item_id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(model => ({
        id: model.item_id
      }))
      .toJSON()

    assert.equal(transformed.id, 3)
  })

  test('an invalid transformer throws an error', async (assert) => {
    assert.plan(2)
    let data = { item_id: 3 }

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
    let transformed = await Bumblebee.create()
      .null()
      .toJSON()

    assert.equal(transformed, null)
  })

  test('if null is passed to item transformer, null is returned', async (assert) => {
    let transformed = await Bumblebee.create()
      .item(null)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, null)
  })

  test('if null is passed to collection transformer, null is returned', async (assert) => {
    let transformed = await Bumblebee.create()
      .collection(null)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, null)
  })

  test('data and transformer can be passed to create method directly', async (assert) => {
    let item = { item_id: 3 }

    let transformedItem = await Bumblebee.create(item, IDTransformer).toJSON()
    assert.equal(transformedItem.id, 3)

    let collection = [{ item_id: 3 }, { item_id: 55 }]

    let transformedCollection = await Bumblebee.create(collection, IDTransformer).toJSON()
    assert.deepEqual(transformedCollection, [{ id: 3 }, { id: 55 }])

    let transformedNull = await Bumblebee.create(null, IDTransformer).toJSON()
    assert.deepEqual(transformedNull, null)
  })
})
