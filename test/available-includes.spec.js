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

const setup = require('./setup')
const Bumblebee = require('../src/Bumblebee')
const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

class Book1Transformer extends TransformerAbstract {
  static get availableInclude () {
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
    return this.item(book.author, author => ({ name: author.name }))
  }
  includeCharacters (book) {
    return this.collection(book.characters, character => ({ name: character.n }))
  }
}

class Book2Transformer extends TransformerAbstract {
  static get availableInclude () {
    return [
      'author',
      'characters'
    ]
  }

  transform (book) {
    return {
      title: book.title
    }
  }

  includeAuthor (book) {
    return this.item(book.author, author => ({ name: author.n }))
  }
  includeCharacters (book) {
    return this.collection(book.characters, Book2CharacterTransformer)
  }
}

class Book2CharacterTransformer extends TransformerAbstract {
  static get availableInclude () {
    return [
      'actor'
    ]
  }

  transform (character) {
    return {
      name: character.n
    }
  }

  includeActor (character) {
    return this.item(character.actor, actor => ({ name: actor.n }))
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

test.group('Available Includes', (group) => {
  group.before(async () => {
    await setup()
  })

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

  test('includes can be defined by relation', async (assert) => {
    let data = {
      title: 'Harry Potter and the Deathly Hallows',
      author: {
        n: 'J. K. Rowling'
      },
      characters: [
        {
          n: 'Harry Potter',
          actor: {
            n: 'Daniel Radcliffe'
          }
        },
        {
          n: 'Hermione Granger',
          actor: {
            n: 'Emma Watson'
          }
        }
      ]
    }

    let expectedTransform = {
      title: 'Harry Potter and the Deathly Hallows',
      author: {
        name: 'J. K. Rowling'
      },
      characters: [
        { name: 'Harry Potter',
          actor: {
            name: 'Daniel Radcliffe'
          }
        },
        { name: 'Hermione Granger',
          actor: {
            name: 'Emma Watson'
          }
        }
      ]
    }

    let transformed = await Bumblebee.create()
      .include(['author', 'characters.actor'])
      .item(data)
      .transformWith(Book2Transformer)
      .toArray()

    assert.deepEqual(transformed, expectedTransform)

    let transformedFromString = await Bumblebee.create()
      .include('author,characters.actor')
      .item(data)
      .transformWith(Book2Transformer)
      .toArray()

    assert.deepEqual(transformedFromString, expectedTransform)
  })
})
