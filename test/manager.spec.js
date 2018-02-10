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
const Manager = require('../src/Bumblebee/Manager')

test.group('Manager', (group) => {
  group.before(async () => {
    await setup()
  })

  test('invalide includes throw an exception', async (assert) => {
    assert.plan(2)

    let manager = new Manager()

    try {
      manager.parseIncludes(null)
    } catch ({message}) {
      assert.equal(message, 'The parseIncludes() method expects a string or an array. object given')
    }

    try {
      manager.parseIncludes(42)
    } catch ({message}) {
      assert.equal(message, 'The parseIncludes() method expects a string or an array. number given')
    }
  })

  test('parseIncludes allows strings and arrays', async (assert) => {
    let manager = new Manager()

    // Does a CSV string work
    manager.parseIncludes('foo,bar')
    assert.deepEqual([...manager.getRequestedIncludes()], ['foo', 'bar'])

    // Does a big array of stuff work
    manager.parseIncludes(['foo', 'bar', 'bar.baz'])
    assert.deepEqual([...manager.getRequestedIncludes()], ['foo', 'bar', 'bar.baz'])

    // Are repeated things stripped
    manager.parseIncludes(['foo', 'foo', 'bar'])
    assert.deepEqual([...manager.getRequestedIncludes()], ['foo', 'bar'])

    // Do requests for `foo.bar` also request `foo`?
    // Are repeated things stripped
    manager.parseIncludes(['foo.bar'])
    assert.deepEqual([...manager.getRequestedIncludes()], ['foo.bar', 'foo'])
  })

  test('parseIncludes respects the recursion limit', async (assert) => {
    let manager = new Manager()

    // Should limit to 10 by default
    manager.parseIncludes('a.b.c.d.e.f.g.h.i.j.NEVER')
    assert.deepEqual(
      [...manager.getRequestedIncludes()],
      [
        'a.b.c.d.e.f.g.h.i.j',
        'a',
        'a.b',
        'a.b.c',
        'a.b.c.d',
        'a.b.c.d.e',
        'a.b.c.d.e.f',
        'a.b.c.d.e.f.g',
        'a.b.c.d.e.f.g.h',
        'a.b.c.d.e.f.g.h.i'
      ]
    )

    // The limit can be set to a different number
    manager.setRecursionLimit(3)
    manager.parseIncludes('a.b.c.NEVER')
    assert.deepEqual(
      [...manager.getRequestedIncludes()],
      [
        'a.b.c',
        'a',
        'a.b'
      ])
  })
})
