'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DisciplinasSchema extends Schema {
  up () {
    this.create('disciplinas', (table) => {
      table.increments()
      table.integer('catalogo_id').notNullable().unsigned().references('id').inTable('catalogos').onDelete('CASCADE')
      table.string('nome', 45).notNullable()
      table.integer('creditos').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('disciplinas')
  }
}

module.exports = DisciplinasSchema
