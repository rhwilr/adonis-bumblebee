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
  transform (model) {
    return {
      id: model.item_id
    }
  }
}

const data = {
  item_id: 3
}

test.group('ArraySerializer', () => {
  test('serialize data into a flat array', async (assert) => {
    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .toArray()

    assert.deepEqual(transformed, { id: 3 })
  })
})
