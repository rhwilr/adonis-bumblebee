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
      'collection',
      'null'
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

  includeNull (model) {
    return this.null()
  }
}

test.group('PlainSerializer', group => {
  let manager

  group.before(async () => {
    manager = Bumblebee.create()
  })

  test('item', async (assert) => {
    let transformed = await manager
      .item({ id: 3 })
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { id: 3 })
  })

  test('collection', async (assert) => {
    let transformed = await manager
      .collection([{ id: 3 }, { id: 7 }])
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, [{ id: 3 }, { id: 7 }])
  })

  test('null', async (assert) => {
    let transformed = await manager
      .item()
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, null)
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

    assert.deepEqual(transformed, [
      { id: 3, primitive: 'Alice' },
      { id: 7, primitive: 'Bob' }
    ])
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

    assert.deepEqual(transformed, [
      { id: 3, item: { name: 'Alice' } },
      { id: 7, item: { name: 'Bob' } }
    ])
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

    assert.deepEqual(transformed, [
      { id: 3, collection: [{ name: 'Alice' }] },
      { id: 7, collection: [{ name: 'Bob' }] }
    ])
  })

  test('includes null', async (assert) => {
    let transformed = await manager
      .collection([
        { id: 3 },
        { id: 7 }
      ])
      .include('null')
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, [
      { id: 3, null: null },
      { id: 7, null: null }
    ])
  })

  test('add meta to a item', async (assert) => {
    let data = {id: 3}

    let transformed = await manager
      .item(data)
      .meta({link: 'rhwilr/adonis-bumblebee'})
      .transformWith(d => ({ id: d.id }))
      .toArray()

    assert.deepEqual(transformed, {id: 3, meta: {link: 'rhwilr/adonis-bumblebee'}})
  })

  test('add meta to a collection', async (assert) => {
    let data = [{id: 3}, {id: 7}]

    let transformed = await manager
      .collection(data)
      .meta({link: 'rhwilr/adonis-bumblebee'})
      .transformWith(d => ({ id: d.id }))
      .toArray()

    assert.deepEqual(transformed, {0: [{id: 3}, {id: 7}], meta: {link: 'rhwilr/adonis-bumblebee'}})
  })
})
