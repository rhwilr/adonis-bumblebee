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
const transform = new Bumblebee({auth: true})

class IDTransformer extends TransformerAbstract {
  transform (model, {auth}) {
    return {
      id: model.item_id,
      context: auth
    }
  }
}

test.group('Context', () => {
  test('the transform method receives the context as an argument', async (assert) => {
    let data = {item_id: 3}

    let transformed = await transform.item(data, IDTransformer)
    assert.equal(transformed.id, 3)
    assert.equal(transformed.context, true)
  })
})
