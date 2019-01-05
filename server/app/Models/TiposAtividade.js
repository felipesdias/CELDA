'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TiposAtividade extends Model {
  catalogo () {
    return this.belongsTo('App/Models/Catalogo')
  }

  atividades () {
    return this.hasMany('App/Models/Atividade')
  }
}

module.exports = TiposAtividade
