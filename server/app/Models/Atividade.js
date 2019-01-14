'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atividade extends Model {
  usuario () {
    return this.belongsTo('App/Models/User')
  }

  catalogo () {
    return this.belongsTo('App/Models/Catalogo')
  }

  tipoAtividade () {
    return this.belongsTo('App/Models/TiposAtividade')
  }

  comprovante() {
    return this.hasOne('App/Models/File')
  }
}

module.exports = Atividade
