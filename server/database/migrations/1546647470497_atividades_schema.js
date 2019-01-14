'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtividadesSchema extends Schema {
  up () {
    this.create('atividades', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('tipos_atividade_id').notNullable().unsigned().references('id').inTable('tipos_atividades').onDelete('CASCADE')
      table.integer('catalogo_id').notNullable().unsigned().references('id').inTable('catalogos').onDelete('CASCADE')
      table.string('nome', 190).notNullable().index()
      table.integer('carga_sugerida')
      table.integer('carga_planejada')
      table.integer('carga_confirmada')
      table.boolean('confirmado').defaultTo(false)
      
      table.timestamps()
    })
  }

  down () {
    this.drop('atividades')
  }
}

module.exports = AtividadesSchema
