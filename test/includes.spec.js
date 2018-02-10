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

class Book2Transformer extends TransformerAbstract {
  availableInclude () {
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
    return this.item(book.author, author => ({name: author.n}))
  }
  includeCharacters (book) {
    return this.collection(book.characters, Book2CharacterTransformer)
  }
}

class Book2CharacterTransformer extends TransformerAbstract {
  availableInclude () {
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
    return this.item(character.actor, actor => ({name: actor.n}))
  }
}

const data = {
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

const expectedTransform = {
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

test.group('Includes can be an array or a string', () => {
  test('includes can be defined by relation', async (assert) => {
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
