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
  static get availableInclude () {
    return [
      'primitive',
      'item',
      'collection',
      'nested',
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

  includeNested (model) {
    return this.collection(model.n, IDTransformer)
  }

  includeNull (model) {
    return this.null()
  }
}

test.group('SLDSerializer', group => {
  let manager

  group.before(async () => {
    manager = Bumblebee.create().setSerializer('sld')
  })

  test('item', async (assert) => {
    const transformed = await manager
      .item({ id: 3 })
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, { data: { id: 3 } })
  })

  test('collection', async (assert) => {
    const transformed = await manager
      .collection([{ id: 3 }, { id: 7 }])
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, { data: [{ id: 3 }, { id: 7 }] })
  })

  test('pagination', async (assert) => {
    const data = {
      rows: [{ id: 3 }, { id: 7 }],
      pages: {
        total: 5,
        perPage: 20,
        page: 1,
        lastPage: 1
      }
    }

    const transformed = await manager
      .paginate(data)
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [{ id: 3 }, { id: 7 }],
      pagination: { total: 5, perPage: 20, page: 1, lastPage: 1 }
    })
  })

  test('null', async (assert) => {
    const transformed = await manager
      .item()
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, null)
  })

  test('includes primitive', async (assert) => {
    const transformed = await manager
      .collection([
        { id: 3, name: 'Alice' },
        { id: 7, name: 'Bob' }
      ])
      .include('primitive')
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [
        { id: 3, primitive: 'Alice' },
        { id: 7, primitive: 'Bob' }
      ]
    })
  })

  test('includes item', async (assert) => {
    const transformed = await manager
      .collection([
        { id: 3, name: 'Alice' },
        { id: 7, name: 'Bob' }
      ])
      .include('item')
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [
        { id: 3, item: { name: 'Alice' } },
        { id: 7, item: { name: 'Bob' } }
      ]
    })
  })

  test('includes collection', async (assert) => {
    const transformed = await manager
      .collection([
        { id: 3, c: [{ name: 'Alice' }] },
        { id: 7, c: [{ name: 'Bob' }] }
      ])
      .include('collection')
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [
        { id: 3, collection: [{ name: 'Alice' }] },
        { id: 7, collection: [{ name: 'Bob' }] }
      ]
    })
  })

  test('includes null', async (assert) => {
    const transformed = await manager
      .collection([
        { id: 3 },
        { id: 7 }
      ])
      .include('null')
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [
        { id: 3, null: null },
        { id: 7, null: null }
      ]
    })
  })

  test('deeply nested', async (assert) => {
    const transformed = await manager
      .collection([
        { id: 3, n: [{ id: 10, name: 'Alice' }] },
        { id: 7, n: [{ id: 11, name: 'Bob' }] }
      ])
      .include('nested,nested.item')
      .transformWith(IDTransformer)
      .toJSON()

    assert.deepEqual(transformed, {
      data: [
        { id: 3, nested: [{ id: 10, item: { name: 'Alice' } }] },
        { id: 7, nested: [{ id: 11, item: { name: 'Bob' } }] }
      ]
    })
  })

  test('add meta to a item', async (assert) => {
    const data = { id: 3 }

    const transformed = await manager
      .item(data)
      .meta({ link: 'rhwilr/adonis-bumblebee' })
      .transformWith(d => ({ id: d.id }))
      .toJSON()

    assert.deepEqual(transformed, { data: { id: 3 }, meta: { link: 'rhwilr/adonis-bumblebee' } })
  })

  test('add meta to a collection', async (assert) => {
    const data = [{ id: 3 }, { id: 7 }]

    const transformed = await manager
      .collection(data)
      .meta({ link: 'rhwilr/adonis-bumblebee' })
      .transformWith(d => ({ id: d.id }))
      .toJSON()

    assert.deepEqual(transformed, { data: [{ id: 3 }, { id: 7 }], meta: { link: 'rhwilr/adonis-bumblebee' } })
  })
})
