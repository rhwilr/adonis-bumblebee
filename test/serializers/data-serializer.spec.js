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

const Bumblebee = require('../../src/Bumblebee')
const TransformerAbstract = require('../../src/Bumblebee/TransformerAbstract')

class IDTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'primitive',
      'item',
      'collection'
    ]
  }

  transform (model) {
    return {
      id: model.id
    }
  }

  includePrimitive (model) {
    return this.item(model, m => m.name)
  }

  includeItem (model) {
    return this.item(model, m => ({ name: m.name }))
  }

  includeCollection (model) {
    return this.collection(model.c, m => ({ name: m.name }))
  }
}

test.group('DataSerializer', group => {
  let manager

  group.before(async () => {
    manager = Bumblebee.create().setSerializer('data')
  })

  test('item', async (assert) => {
    let transformed = await manager
      .item({ id: 3 })
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { data: { id: 3 } })
  })

  test('collection', async (assert) => {
    let transformed = await manager
      .collection([{ id: 3 }, { id: 7 }])
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { data: [{ id: 3 }, { id: 7 }] })
  })

  test('includes primitive', async (assert) => {
    let transformed = await manager
      .collection([
        { id: 3, name: 'Alice' },
        { id: 7, name: 'Bob' }
      ])
      .include('primitive')
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { data: [
      { id: 3, primitive: 'Alice' },
      { id: 7, primitive: 'Bob' }
    ] })
  })

  test('includes item', async (assert) => {
    let transformed = await manager
      .collection([
        { id: 3, name: 'Alice' },
        { id: 7, name: 'Bob' }
      ])
      .include('item')
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { data: [
      { id: 3, item: { data: { name: 'Alice' } } },
      { id: 7, item: { data: { name: 'Bob' } } }
    ] })
  })

  test('includes collection', async (assert) => {
    let transformed = await manager
      .collection([
        { id: 3, c: [{ name: 'Alice' }] },
        { id: 7, c: [{ name: 'Bob' }] }
      ])
      .include('collection')
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { data: [
      { id: 3, collection: { data: [{ name: 'Alice' }] } },
      { id: 7, collection: { data: [{ name: 'Bob' }] } }
    ] })
  })
})
