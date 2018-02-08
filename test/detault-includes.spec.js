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

class BookTransformer extends TransformerAbstract {
  defaultInclude () {
    return [
      'author'
    ]
  }

  transform (book) {
    return {
      id: book.id,
      title: book.title,
      year: book.yr
    }
  }

  includeAuthor (book) {
    return this.item(book.author, author => ({name: author.name}))
  }
}

test.group('Default Includes', () => {
  test('a deftault include is appended to the model', async (assert) => {
    let data = {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      yr: 2001,
      author: {
        name: 'J. K. Rowling'
      }
    }

    let transformed = await Bumblebee.create()
    .item(data)
    .transformWith(BookTransformer)
    .toArray()

    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      author: {
        name: 'J. K. Rowling'
      }
    })
  })
})
