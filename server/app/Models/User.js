'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  atividadesByCatalogo (catalogoId) {
    return this.hasMany('App/Models/Atividade').where('catalogo_id', catalogoId)
  }

  atividades () {
    return this.hasMany('App/Models/Atividade')
  }

  disciplinasByCatalogo (catalogoId) {
    return this.belongsToMany('App/Models/Disciplina').where('catalogo_id', catalogoId)
  }

  disciplinas () {
    return this.belongsToMany('App/Models/Disciplina')
  }

  catalogo () {
    return this.belongsTo('App/Models/Catalogo')
  }
}

module.exports = User
