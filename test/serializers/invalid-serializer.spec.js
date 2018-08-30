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
const SerializerAbstract = require('../../src/Bumblebee/Serializers/SerializerAbstract')

class InvalidSerializer extends SerializerAbstract {
}

class InvalidSerializerWithCollection extends SerializerAbstract {
  async collection (data) {
    return data
  }
}

test.group('InvalidSerializer', group => {
  let manager

  group.before(async () => {
    manager = Bumblebee.create().setSerializer(new InvalidSerializer())
  })

  test('item', async (assert) => {
    assert.plan(1)

    try {
      await manager
        .item({ id: 3 })
        .transformWith(m => {})
        .toArray()
    } catch ({ message }) {
      assert.equal(message, 'A Serializer must implement the method item')
    }
  })

  test('collection', async (assert) => {
    assert.plan(1)

    try {
      await manager
        .collection([{ id: 3 }, { id: 7 }])
        .transformWith(m => {})
        .toArray()
    } catch ({ message }) {
      assert.equal(message, 'A Serializer must implement the method collection')
    }
  })

  test('null', async (assert) => {
    assert.plan(1)

    try {
      await manager
        .null()
        .transformWith(m => {})
        .toArray()
    } catch ({ message }) {
      assert.equal(message, 'A Serializer must implement the method null')
    }
  })

  test('meta', async (assert) => {
    assert.plan(1)

    try {
      await manager.setSerializer(new InvalidSerializerWithCollection())
        .collection([{ id: 3 }])
        .meta({})
        .transformWith(m => {})
        .toArray()
    } catch ({ message }) {
      assert.equal(message, 'A Serializer must implement the method meta')
    }
  })

  test('paginator', async (assert) => {
    assert.plan(1)

    const data = {
      rows: [{ item_id: 3 }, { item_id: 7 }],
      pages: {
        total: 5,
        perPage: 20,
        page: 1,
        lastPage: 1
      }
    }

    try {
      await manager.setSerializer(new InvalidSerializerWithCollection())
        .paginate(data)
        .transformWith(m => {})
        .toArray()
    } catch ({ message }) {
      assert.equal(message, 'A Serializer must implement the method paginator')
    }
  })
})
