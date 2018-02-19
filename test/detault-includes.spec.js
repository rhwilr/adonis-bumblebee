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

class Book2Transformer extends TransformerAbstract {
  defaultInclude () {
    return [
      'author',
      'characters',
      'voldemort'
    ]
  }

  transform (book) {
    return {
      title: book.title
    }
  }

  includeAuthor (book) {
    return this.item(book.author, author => ({name: author.n}))
  }
  includeCharacters (book) {
    return this.collection(book.characters, Book2CharacterTransformer)
  }
  includeVoldemort (book) {
    return this.null()
  }
}

class Book2CharacterTransformer extends TransformerAbstract {
  transform (character) {
    return {
      name: character.n
    }
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

  test('all transform types can be used in includes', async (assert) => {
    let data = {
      title: 'Harry Potter and the Chamber of Secrets',
      author: {
        n: 'J. K. Rowling'
      },
      characters: [
        { n: 'Harry Potter' },
        { n: 'Ron Weasley' },
        { n: 'Hermione Granger' }
      ]
    }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book2Transformer)
      .toArray()

    assert.deepEqual(transformed, {
      title: 'Harry Potter and the Chamber of Secrets',
      author: {
        name: 'J. K. Rowling'
      },
      characters: [
        { name: 'Harry Potter' },
        { name: 'Ron Weasley' },
        { name: 'Hermione Granger' }
      ],
      voldemort: null
    })
  })
})
