'use strict'

const Catalogo = use('App/Models/Catalogo')

class CatalogoController {
  async create ({ request }) {

    const catalogoData = request.only(['nome'])

    return await Catalogo.create(catalogoData)
  }
}



module.exports = CatalogoController
