'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileSchema extends Schema {
  up () {
    this.create('files', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('atividade_id').unique().unsigned().references('id').inTable('atividades').onDelete('CASCADE')
      table.string('nome', '190').unique().notNullable()
      table.string('path', 1000).index().notNullable()
      table.string('url', 1000).index().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('files')
  }
}

module.exports = FileSchema
