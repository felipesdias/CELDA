'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Disciplina extends Model {
  catalogo () {
    return this.belongsTo('App/Models/Catalogo')
  }

  usuarios () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = Disciplina
