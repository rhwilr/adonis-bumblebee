'user strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { _upperFirst, _camelCase } = require('lodash')
const { Command } = require('@adonisjs/ace')
const { join } = require('path')

class MakeTransformer extends Command {
  /**
   * The signature for the Make command
   */
  static get signature () {
    return `make:transformer { name: Name of Transformer }`
  }

  /**
   * The description for the command
   */
  static get description () {
    return 'Make a new transformer for adonis-bumblebee'
  }

  /**
   * Creates a new Transformer class from the template
   *
   * @param {*} name
   */
  async handle ({ name }) {
    try {
      // generate file path and classname for the Transformer class from the provided name
      const className = this.getClassname(name)
      const directoryPath = this.getDirectoryPath(name)
      const filePath = join(directoryPath, className) + '.js'

      // compile the template with the provided classname
      const templatePath = join(__dirname, '../../templates/Transformer.mustache')
      const templateContent = await this.readFile(templatePath, 'utf-8')

      // save the generated file
      await this.generateFile(filePath, templateContent, { className })

      console.log(`${this.icon('success')} ${this.chalk.green('create')}  ${filePath}`)
    } catch ({ message }) {
      this.error(message)
    }
  }

  /**
   * Transform the name to a camelCase name with Transformer at the end
   *
   * @param {*} name
   */
  getClassname (name) {
    let directories = name.split('/')
    let filename = directories[directories.length - 1]

    return (_upperFirst(_camelCase(filename.replace('Transformer', ''))) + 'Transformer')
  }

  /**
   * Extract the directory path from the name
   *
   * @param {*} name
   */
  getDirectoryPath (name) {
    let directories = name.split('/')

    // remove the last element in the list, since the is the filename
    directories.splice(-1, 1)
    directories = directories.join('/')

    return join('app/Transformers', directories)
  }
}

module.exports = MakeTransformer
