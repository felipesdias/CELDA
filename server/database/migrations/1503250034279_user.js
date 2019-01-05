'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('catalogo_id').unsigned().references('id').inTable('catalogo')
      table.string('nome', 190).notNullable().index()
      table.string('matricula', 15).notNullable().unique()
      table.string('tipo', 20).notNullable().index()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
