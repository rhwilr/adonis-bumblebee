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

const Manager = require('../src/Bumblebee/Manager')
const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class IDTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'notexisting'
    ]
  }

  transform (model) {
    return {
      id: model.item_id
    }
  }
}

test.group('Exception', (group) => {
  test('throw excexption if include function is not defined', async (assert) => {
    assert.plan(1)

    let data = {item_id: 3}

    try {
      await Bumblebee.create()
        .item(data)
        .include(['notexisting'])
        .transformWith(IDTransformer)
        .toArray()
    } catch ({message}) {
      assert.equal(message, 'A method called \'includeNotexisting\' could not be found in \'IDTransformer\'')
    }
  })

  test('invalide includes throw an exception', async (assert) => {
    assert.plan(2)

    let manager = new Manager()

    try {
      manager.parseIncludes(null)
    } catch ({message}) {
      assert.equal(message, 'The parseIncludes() method expects a string or an array. object given')
    }

    try {
      manager.parseIncludes(42)
    } catch ({message}) {
      assert.equal(message, 'The parseIncludes() method expects a string or an array. number given')
    }
  })

  test('pagination can only accept a lucid model', async (assert) => {
    assert.plan(1)

    try {
      await Bumblebee.create()
        .paginate([{item_id: 3}])
        .toArray()
    } catch ({message}) {
      assert.equal(message, 'The paginate() method only accepts query builder results with pagination.')
    }
  })

  test('exception if an undefined resource is passed', async (assert) => {
    assert.plan(1)

    try {
      await Bumblebee.create()
        ._setData('ResourceAbstract', [{item_id: 3}])
        .toArray()
    } catch ({message}) {
      assert.equal(message, 'This resourcetype is not supported. Use Item or Collection')
    }
  })
})
