'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *lucid().Model
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')

const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

const UserItem = {
  $attributes: {
    id: 1,
    first_name: 'Darth',
    last_name: 'Vader',
    email: 'darth_vader@starwars.com'
  },

  getFullname () {
    return `${this.first_name} ${this.last_name}`
  }
}

const UserItemModel = new Proxy(UserItem, {
  get (obj, prop) {
    return obj.$attributes[prop] ? obj.$attributes[prop] : obj[prop]
  }
})

const UserCollectionModel = {
  rows: [UserItemModel],

  isOne: false
}

class UserTransformer extends TransformerAbstract {
  transform (model) {
    return {
      id: model.id,
      first_name: model.first_name,
      last_name: model.last_name,
      email: model.email,
      full_name: model.getFullname()
    }
  }
}

const expectedTransform = {
  id: 1,
  first_name: 'Darth',
  last_name: 'Vader',
  email: 'darth_vader@starwars.com',
  full_name: 'Darth Vader'
}

test.group('Lucid', () => {
  test('a lucid item can be transformed', async (assert) => {
    const transformed = await Bumblebee.create()
      .item(UserItemModel, UserTransformer)

    assert.deepEqual(transformed, expectedTransform)
  })

  test('a lucid collection can be transformed', async (assert) => {
    const transformed = await Bumblebee.create()
      .collection(UserCollectionModel, UserTransformer)

    assert.deepEqual(transformed, [expectedTransform])
  })
})
