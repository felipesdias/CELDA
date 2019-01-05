'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DisciplinasSchema extends Schema {
  up () {
    this.create('disciplinas', (table) => {
      table.increments()
      table.integer('catalogo_id').notNullable().unsigned().references('id').inTable('catalogo')
      table.string('nome', 45).notNullable()
      table.int('creditos').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('disciplinas')
  }
}

module.exports = DisciplinasSchema