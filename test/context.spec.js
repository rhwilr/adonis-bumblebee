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

const setup = require('./setup')
const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class IDTransformer extends TransformerAbstract {
  transform (model, {env}) {
    return {
      id: model.item_id,
      env: env
    }
  }
}

test.group('Context', (group) => {
  group.before(async () => {
    await setup()
  })

  test('context can be passed to bumblebee and injected into transformer', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const ctx = new Context()

    let data = {item_id: 3}

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(IDTransformer)
      .withContext(ctx)
      .toArray()

    assert.equal(transformed.id, 3)
    assert.equal(transformed.env, 'testing')
  })

  test('the transform method is injected into the http context', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = {item_id: 3}

    let transformed = await transform
      .item(data)
      .transformWith(model => ({id: model.item_id}))
      .toArray()

    assert.equal(transformed.id, 3)
  })

  test('the context is injected automatically in the http context', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = {item_id: 3}

    let transformed = await transform
      .item(data)
      .transformWith(IDTransformer)
      .toArray()

    assert.equal(transformed.id, 3)
    assert.equal(transformed.env, 'testing')
  })

  test('the TransformerAbstract can be importet from the ioc', async (assert) => {
    const TransformerAbstract = ioc.use('Adonis/Addons/Bumblebee/TransformerAbstract')

    class UserTransformer extends TransformerAbstract {
      transform (model) {
        return {
          id: model.id
        }
      }
    }

    let data = {id: 42}

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(UserTransformer)
      .toArray()

    assert.equal(transformed.id, 42)
  })

  test('Bumblebee can be importet from the ioc', async (assert) => {
    const BumblebeeIoc = ioc.use('Adonis/Addons/Bumblebee')

    assert.deepEqual(BumblebeeIoc, Bumblebee)
  })
})
