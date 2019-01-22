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

test.group('Meta', () => {
  test('add meta to a item', async (assert) => {
    let data = { id: 3 }

    let transformed = await Bumblebee.create()
      .item(data)
      .meta({ link: 'rhwilr/adonis-bumblebee' })
      .transformWith(d => ({ id: d.id }))
      .toJSON()

    assert.deepEqual(transformed, { id: 3, meta: { link: 'rhwilr/adonis-bumblebee' } })
  })

  test('add meta to a collection', async (assert) => {
    let data = [{ id: 3 }, { id: 7 }]

    let transformed = await Bumblebee.create()
      .collection(data)
      .meta({ link: 'rhwilr/adonis-bumblebee' })
      .transformWith(d => ({ id: d.id }))
      .toJSON()

    assert.deepEqual(transformed, { data: [{ id: 3 }, { id: 7 }], meta: { link: 'rhwilr/adonis-bumblebee' } })
  })

  test('add meta to a primitive value', async (assert) => {
    let data = 1

    let transformed = await Bumblebee.create()
      .item(data)
      .meta({ link: 'rhwilr/adonis-bumblebee' })
      .transformWith(d => (d))
      .toJSON()

    assert.deepEqual(transformed, { data: 1, meta: { link: 'rhwilr/adonis-bumblebee' } })
  })
})
