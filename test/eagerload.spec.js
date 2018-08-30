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
      'dragon',
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
    return this.item(book.getRelated('author'), author => ({ name: author.name }))
  }
  includeDragon (book) {
    return this.item(book.getRelated('dragon'), dragon => ({ name: dragon.name }))
  }
  includeCharacters (book) {
    return this.collection(book.getRelated('characters'), character => ({ name: character.n }))
  }
}

const data = {
  id: 1,
  title: 'Harry Potter and the Philosopher\'s Stone',
  yr: 2001,

  author: () => ({
    name: 'J. K. Rowling'
  }),
  dragon: () => null,
  characters: () => ([
    { n: 'Harry Potter' },
    { n: 'Hermione Granger' }
  ]),

  // mock for lucid eagerloading api
  $relations: {},
  $loadCalled: 0,
  getRelated: (prop) => data.$relations[prop],
  loadMany: (props) => {
    props.forEach(prop => {
      if (data.$relations[prop] !== undefined) {
        throw new Error(`E_CANNOT_OVERRIDE_RELATION: ${prop}`)
      }

      data.$relations[prop] = data[prop]()
    })
    data.$loadCalled++
  }
}

test.group('EagerLoading', (group) => {
  group.beforeEach(async () => {
    data.$loadCalled = 0
    data.$relations = {}
  })

  test('an include function eagerloads the relationship', async (assert) => {
    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book1Transformer)
      .include(['author'])
      .toArray()

    assert.equal(data.$loadCalled, 1)
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

    assert.equal(data.$loadCalled, 1)
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

  test('do not eagerload a relation twice', async (assert) => {
    assert.plan(3)

    // load the relation prior to calling the transformer
    data.loadMany(['author'])

    // make sure mock throws an exception if loaded twice
    try {
      data.loadMany(['author'])
    } catch ({ message }) {
      assert.equal(message, 'E_CANNOT_OVERRIDE_RELATION: author')
    }

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book1Transformer)
      .include(['author'])
      .toArray()

    assert.equal(data.$loadCalled, 1)
    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      author: {
        name: 'J. K. Rowling'
      }
    })
  })

  test('do not eagerload a relation that is null', async (assert) => {
    // load the relation prior to calling the transformer
    data.loadMany(['dragon'])

    // now the relation is loaded, but there is no record linked with this relation
    // so the relation prop will be null
    assert.equal(data.$relations['dragon'], null)

    let transformed = await Bumblebee.create()
      .item(data)
      .transformWith(Book1Transformer)
      .include(['dragon'])
      .toArray()

    assert.equal(data.$loadCalled, 1)
    assert.deepEqual(transformed, {
      id: 1,
      title: 'Harry Potter and the Philosopher\'s Stone',
      year: 2001,
      dragon: null
    })
  })
})
