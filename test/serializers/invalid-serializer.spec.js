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
    } catch ({message}) {
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
    } catch ({message}) {
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
    } catch ({message}) {
      assert.equal(message, 'A Serializer must implement the method null')
    }
  })
})
