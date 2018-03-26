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

const User = {
  $attributes: {
    id: 1,
    first_name: 'Darth',
    last_name: 'Vader',
    email: 'darth_vader@starwars.com'
  },

  getFullname () {
    return `${this.first_name} ${this.last_name}`
  },

  toJSON () {
    return this.$attributes
  }
}

const UserModel = new Proxy(User, {
  get (obj, prop) {
    return obj.$attributes[prop] ? obj.$attributes[prop] : obj[prop]
  }
})

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
    let transformed = await Bumblebee.create()
      .item(UserModel, UserTransformer)

    assert.deepEqual(transformed, expectedTransform)
  })
})
