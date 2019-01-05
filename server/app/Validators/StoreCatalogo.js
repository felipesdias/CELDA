'use strict'

class StoreCatalogo {
  get rules () {
    return {
      nome: 'required|unique:catalogos,nome',
    }
  }

  get messages () {
    return {
      unique: 'Já existe um catálogo com este nome'
    }
  }

  async authorize () {
    const user = await this.ctx.auth.getUser()
    if (!user.tipo != 'adm') {
      this.ctx.response.unauthorized({ message: 'Not authorized' })
      return false
    }

    return true
  }
}

module.exports = StoreCatalogo
