'use strict'

class StoreCatalogo {
  get rules () {
    const catalogoId = this.ctx.params.id

    return {
      nome: `required|unique:catalogos,nome,id,${catalogoId}`,
    }
  }

  get messages () {
    return {
      unique: 'Já existe um catálogo com este nome'
    }
  }
}

module.exports = StoreCatalogo
