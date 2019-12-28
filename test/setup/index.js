'use strict'

const path = require('path')
const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Config } = require('@adonisjs/sink')
const { Macroable } = require('macroable')

class Context extends Macroable {
  static onReady () {}
  constructor () {
    super()
    this._qs = {}

    this.env = 'testing'

    // mock for the ctx.request object to get query params
    this.request = {
      get: () => this._qs
    }
  }
}
Context.getters = {}
Context.macros = {}

module.exports = async () => {
  ioc.bind('Adonis/Src/HttpContext', () => {
    return Context
  })

  ioc.singleton('Adonis/Src/Config', () => {
    const config = new Config()

    config.set('bumblebee', {
      parseRequest: false,
      includeRecursionLimit: 10
    })

    return config
  })

  resolver.appNamespace('App')

  await registrar.providers([
    path.join(__dirname, '../../providers/BumblebeeProvider'),
    path.join(__dirname, '../../providers/CommandsProvider')
  ]).registerAndBoot()
}
