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

class Book1Transformer extends TransformerAbstract {
  availableInclude () {
    return [
      'author',
      'characters'
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
  includeCharacters (book) {
    return this.collection(book.characters, character => ({name: character.n}))
  }
}

const data = {
  id: 1,
  title: 'Harry Potter and the Philosopher\'s Stone',
  yr: 2001,
  author: {
    name: 'J. K. Rowling'
  },
  characters: [
    { n: 'Harry Potter' },
    { n: 'Ron Weasley' },
    { n: 'Hermione Granger' }
  ]
}

test.group('Available Includes', () => {
  test('an availableInclude is not addad by default', async (assert) => {
    let transformed = await Bumblebee.create()
    .item(data)
    .transformWith(Book1Transformer)
    .toArray()

    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001
    })
  })

  test('an include can be request', async (assert) => {
    let transformed = await Bumblebee.create()
    .include('author')
    .item(data)
    .transformWith(Book1Transformer)
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

  test('multiple includes can be requested at once', async (assert) => {
    let transformed = await Bumblebee.create()
    .include(['author', 'characters'])
    .item(data)
    .transformWith(Book1Transformer)
    .toArray()

    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      author: {
        name: 'J. K. Rowling'
      },
      characters: [
        { name: 'Harry Potter' },
        { name: 'Ron Weasley' },
        { name: 'Hermione Granger' }
      ]
    })
  })
})
