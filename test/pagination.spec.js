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

const data = {
  rows: [{item_id: 3}, {item_id: 7}],
  pages: {
    total: 5,
    perPage: 20,
    page: 1,
    lastPage: 1
  }
}

test.group('Pagination', () => {
  test('paginate a adonis lucid model', async (assert) => {
    let transformed = await Bumblebee.create()
      .paginate(data)
      .transformWith(d => ({ id: d.item_id }))
      .serializeWith('data')
      .toArray()

    assert.deepEqual(transformed, {
      pagination: {
        total: 5,
        perPage: 20,
        page: 1,
        lastPage: 1
      },
      data: [{id: 3}, {id: 7}]
    })
  })

  test('ensure integer pagination data', async (assert) => {
    // Overwrite with a string to ensure transformation
    data.pages.page = '2'

    let transformed = await Bumblebee.create()
      .paginate(data)
      .transformWith(d => ({ id: d.item_id }))
      .serializeWith('data')
      .toArray()

    assert.deepEqual(transformed, {
      pagination: {
        total: 5,
        perPage: 20,
        page: 2,
        lastPage: 1
      },
      data: [{id: 3}, {id: 7}]
    })
  })
})
