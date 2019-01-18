'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {
    static get hidden () {
        return ['path']
    }
    usuario () {
        return this.belongsTo('App/Models/User')
    }

    atividade () {
        return this.belongsTo('App/Models/Atividade')
    }
}

module.exports = File
