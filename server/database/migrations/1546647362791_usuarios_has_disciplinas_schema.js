'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuariosHasDisciplinasSchema extends Schema {
  up () {
    this.create('disciplina_user', (table) => {
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('disciplina_id').notNullable().unsigned().references('id').inTable('disciplinas').onDelete('CASCADE')
      table.timestamps()
      table.primary(['user_id', 'disciplina_id'])
    })
  }

  down () {
    this.drop('usuarios_has_disciplinas')
  }
}

module.exports = UsuariosHasDisciplinasSchema
