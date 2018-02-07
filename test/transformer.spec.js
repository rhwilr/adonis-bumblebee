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
const transform = new Bumblebee()

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

    let transformed = await transform.item(data, IDTransformer)
    assert.equal(transformed.id, 3)
  })

  test('a transformer can transform a collection of items', async (assert) => {
    let data = [{item_id: 3}, {item_id: 55}]

    let transformed = await transform.collection(data, IDTransformer)
    assert.deepEqual(transformed, [{id: 3}, {id: 55}])
  })

  test('a transformer can transform a collection of lucid rows', async (assert) => {
    let data = {rows: [{item_id: 3}, {item_id: 55}]}

    let transformed = await transform.collection(data, IDTransformer)
    assert.deepEqual(transformed, [{id: 3}, {id: 55}])
  })

  test('a transformer must implement the transform method', async (assert) => {
    assert.plan(1)
    class InvalidTransformer extends TransformerAbstract {}
    let data = {item_id: 3}

    try {
      await transform.item(data, InvalidTransformer)
    } catch (error) {
      assert.equal(error.message, 'You have to implement the method transform!')
    }
  })
})
