'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuariosHasDisciplinasSchema extends Schema {
  up () {
    this.create('usuarios_has_disciplinas', (table) => {
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('disciplina_id').notNullable().unsigned().references('id').inTable('disciplinas')
      table.timestamps()
    })
  }

  down () {
    this.drop('usuarios_has_disciplinas')
  }
}

module.exports = UsuariosHasDisciplinasSchema
