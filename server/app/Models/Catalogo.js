'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Catalogo extends Model {
  usuarios () {
    return this.hasMany('App/Models/User')
  }

  disciplinas () {
    return this.hasMany('App/Models/Disciplina')
  }

  atividades () {
    return this.hasMany('App/Models/Atividade')
  }

  tiposAtividades () {
    return this.hasMany('App/Models/TiposAtividade')
  }
}

module.exports = Catalogo
