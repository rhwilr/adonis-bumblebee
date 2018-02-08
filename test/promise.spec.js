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
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class BookTransformer extends TransformerAbstract {
  defaultInclude () {
    return [
      'author'
    ]
  }

  async transform (book) {
    return {
      id: book.id,
      title: book.title,
      year: book.yr
    }
  }

  async includeAuthor (book) {
    return this.item(book.author, author => ({name: author.name}))
  }
}

test.group('Promise', (group) => {
  group.before(async () => {
    await setup()
  })

  test('data can be a promise and will resolve before transforming', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = new Promise((resolve, reject) => {
      setTimeout(resolve, 1, {item_id: 3})
    })

    let transformed = await transform
    .item(data, model => ({id: model.item_id}))

    assert.equal(transformed.id, 3)
  })

  test('the transform function can be a promise', async (assert) => {
    const Context = ioc.use('Adonis/Src/HttpContext')
    const {transform} = new Context()

    let data = {
      id: 1,
      title: 'A Game of Thrones',
      yr: 1996,
      author: {
        name: 'George R. R. Martin'
      }
    }

    let transformed = await transform
    .item(data, BookTransformer)

    assert.deepEqual(transformed, {
      id: 1,
      title: 'A Game of Thrones',
      year: 1996,
      author: {
        name: 'George R. R. Martin'
      }
    })
  })
})
