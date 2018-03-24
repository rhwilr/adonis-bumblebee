'use strict'

module.exports = {
  /*
   * When enabled, Bulblebee will automatically parse the ?include=
   * parameter and include all requested resources
   */
  parseRequest: false,

  /*
   * Nested includes will be resolved up to this limit
   * any further nested resources are going to be ignored
   */
  includeRecursionLimit: 10,

  /*
   * The serializer will be used to transform the data
   * into it's final representation.
   * Currently supported: 'plain', 'data'
   */
  serializer: 'plain'
}
