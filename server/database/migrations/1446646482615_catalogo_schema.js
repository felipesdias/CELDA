'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CatalogoSchema extends Schema {
  up () {
    this.create('catalogos', (table) => {
      table.increments()
      table.string('nome', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('catalogos')
  }
}

module.exports = CatalogoSchema
