'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('catalogo_id').unsigned().index()
      table.string('nome', 190).notNullable().index()
      table.string('matricula', 15).notNullable().unique()
      table.string('tipo', 20).notNullable().index()
      table.string('email', 254).notNullable().unique()
      table.boolean('old').defaultTo(false).index()
      table.boolean('finalizado').defaultTo(false).index()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
