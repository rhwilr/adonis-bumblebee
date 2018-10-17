'user strict'

/**
 * adonis-bumblebee
 *
 * (c) Ralph Huwiler <ralph@huwiler.rocks>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { Command } = require('@adonisjs/ace')
const { join } = require('path')
const _ = require('lodash')

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
      name = this.getName(name)
      const templatePath = join(__dirname, '../../templates/Transformer.mustache')
      const templateContent = await this.readFile(templatePath, 'utf-8')
      const filePath = join('app/Transformers', name) + '.js'

      await this.generateFile(filePath, templateContent, { name })

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
  getName (name) {
    return _.upperFirst(_.camelCase(name.replace('Transformer', ''))) + 'Transformer'
  }
}

module.exports = MakeTransformer
