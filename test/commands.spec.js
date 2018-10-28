'use strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const fs = require('fs')
const test = require('japa')
const path = require('path')
const ace = require('@adonisjs/ace')

const setup = require('./setup')
const MakeTransformer = require('../src/Commands/MakeTransformer')
const originalConsoleLog = console.log
const originalConsoleError = console.error

test.group('Commands', group => {
  let lastLogged
  const transformerFilePath = path.join(__dirname, '../app/Transformers/TestTransformer.js')
  const transformerFileWithSubdirectoryPath = path.join(__dirname, '../app/Transformers/Dir/TestTransformer.js')

  group.before(async () => {
    await setup()
    console.log = console.error = (string) => { lastLogged = string }
  })

  group.afterEach(() => {
    // cleanup
    try {
      fs.unlinkSync(transformerFilePath)
      fs.unlinkSync(transformerFileWithSubdirectoryPath)
      fs.rmdirSync(path.join(__dirname, '../app/Transformers/Dir/'))
      fs.rmdirSync(path.join(__dirname, '../app/Transformers/'))
      fs.rmdirSync(path.join(__dirname, '../app/'))
    } catch (e) {}
  })

  group.after(() => {
    // restore the original log function
    console.log = originalConsoleLog
    console.error = originalConsoleError
  })

  test('Create a transformer', async assert => {
    await ace.call('make:transformer', { name: 'Test' })
    assert.isTrue(fs.existsSync(transformerFilePath))
    assert.equal(lastLogged, '✔ create  app/Transformers/TestTransformer.js')
  })

  test('Create a transformer in a subdirectory', async assert => {
    await ace.call('make:transformer', { name: 'Dir/Test' })
    assert.isTrue(fs.existsSync(transformerFileWithSubdirectoryPath))
    assert.equal(lastLogged, '✔ create  app/Transformers/Dir/TestTransformer.js')
  })

  test('Call the create command twice prints an error', async assert => {
    await ace.call('make:transformer', { name: 'Test' })
    assert.isTrue(fs.existsSync(transformerFilePath))

    await ace.call('make:transformer', { name: 'Test' })
    assert.equal(lastLogged, 'app/Transformers/TestTransformer.js already exists')
  })

  test('Make command has a description', async assert => {
    assert.equal(MakeTransformer.description, 'Make a new transformer for adonis-bumblebee')
  })
})
