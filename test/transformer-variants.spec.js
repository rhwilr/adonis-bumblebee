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
const { ioc } = require('@adonisjs/fold')

const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class IDTransformer extends TransformerAbstract {
  transformVariant1 (model) {
    return {
      id: model.item_id
    }
  }

  transformVariant2 (model) {
    return {
      identifier: model.item_id
    }
  }
}

test.group('Transformer Variants', () => {
  test('a specific variant can be used for the transformer method', async (assert) => {
    let data = { item_id: 3 }

    let transformedVariant1 = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .usingVariant('variant1')
      .toJSON()

    assert.equal(transformedVariant1.id, 3)

    let transformedVariant2 = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .usingVariant('variant2')
      .toJSON()

    assert.equal(transformedVariant2.identifier, 3)
  })

  test('a transformer can be defined using dot-notation', async (assert) => {
    ioc.bind('App/Transformers/IDTransformer', () => new IDTransformer())

    let data = { item_id: 3 }

    let transformedVariant1 = await Bumblebee.create()
      .item(data)
      .transformWith('App/Transformers/IDTransformer.variant1')
      .toJSON()

    assert.equal(transformedVariant1.id, 3)
  })

  test('variants can be used in shorthand form', async (assert) => {
    ioc.bind('App/Transformers/IDTransformer', () => new IDTransformer())

    let data = { item_id: 3 }

    let transformedVariant1 = await Bumblebee.create()
      .item(data, 'App/Transformers/IDTransformer.variant1')

    assert.equal(transformedVariant1.id, 3)

    let transformedVariant2 = await Bumblebee.create()
      .collection([data], 'App/Transformers/IDTransformer.variant2')

    assert.equal(transformedVariant2[0].identifier, 3)
  })

  test('an error is thrown if an invalid variant is passed', async (assert) => {
    assert.plan(1)

    let data = { item_id: 3 }

    try {
      await Bumblebee.create()
        .item(data)
        .transformWith(IDTransformer)
        .usingVariant('variantX')
        .toJSON()
    } catch ({ message }) {
      assert.equal(message, 'A transformer method \'transformVariantX\' could not be found in \'IDTransformer\'')
    }
  })
})
