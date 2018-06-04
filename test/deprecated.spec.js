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

const TransformerAbstract = require('../src/Bumblebee/TransformerAbstract')

test.group('Deprecated', () => {
  test('check deprecated methods are still callable', async (assert) => {
    assert.plan(5)
    const originalLog = console.warn

    console.warn = (message) => {
      assert.equal(!!message.match(/(Deprecation warning)(.*)/), true)
    }

    const transformer = new TransformerAbstract()

    await transformer.processIncludedResources('', {}).catch(e => {})
    await transformer.callIncludeFunction('', {}).catch(e => {})
    await transformer.figureOutWhichIncludes('', {}).catch(e => {})
    await transformer.createChildScopeFor('', {}).catch(e => {})
    await transformer.eagerloadIncludedResource('', {}).catch(e => {})

    console.warn = originalLog
  })
})
