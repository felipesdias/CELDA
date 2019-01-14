'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TiposAtividadesSchema extends Schema {
  up () {
    this.create('tipos_atividades', (table) => {
      table.increments()
      table.integer('catalogo_id').notNullable().unsigned().references('id').inTable('catalogos').onDelete('CASCADE')
      table.string('nome', 300).notNullable().index()
      table.string('descricao', 1000).notNullable().index()
      table.integer('ordem').notNullable()
      table.integer('max_carga_horaria').notNullable()
      table.integer('max_carga_horaria_atividade').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tipos_atividades')
  }
}

module.exports = TiposAtividadesSchema
