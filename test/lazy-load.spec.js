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
    return this.item(book.getRelated('author'), author => ({name: author.name}))
  }
  includeCharacters (book) {
    return this.collection(book.getRelated('characters'), character => ({name: character.n}))
  }
}

const data = {
  id: 1,
  title: 'Harry Potter and the Philosopher\'s Stone',
  yr: 2001,

  author: () => ({
    name: 'J. K. Rowling'
  }),
  characters: () => ([
    { n: 'Harry Potter' },
    { n: 'Hermione Granger' }
  ]),

  // mock for lucid eagerloading api
  getRelated: (prop) => eagerLoaded[prop],
  loadMany: (props) => {
    eagerLoaded._loadCalled++
    props.forEach(prop => {
      eagerLoaded[prop] = data[prop]()
    })
  }
}
let eagerLoaded = {
  _loadCalled: 0
}

test.group('Lazy-Loading', (group) => {
  group.beforeEach(async () => {
    eagerLoaded._loadCalled = 0
  })

  test('an include function lazyloads the relationship', async (assert) => {
    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book1Transformer)
      .include(['author'])
      .toArray()

    assert.equal(eagerLoaded._loadCalled, 1)
    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      author: {
        name: 'J. K. Rowling'
      }
    })
  })

  test('multiple include functions load all relations at once', async (assert) => {
    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book1Transformer)
      .include(['author', 'characters'])
      .toArray()

    assert.equal(eagerLoaded._loadCalled, 1)
    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      author: {
        name: 'J. K. Rowling'
      },
      characters: [
        { name: 'Harry Potter' },
        { name: 'Hermione Granger' }
      ]
    })
  })
})
