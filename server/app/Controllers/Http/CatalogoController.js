'use strict'

const Catalogo = use('App/Models/Catalogo')

class CatalogoController {
    async indexAll () {
        return await Catalogo.all()
    }

    async index ({ params }) {
        return await Catalogo.query()
                        .with('disciplinas')
                        .with('tiposAtividades')
                        .where('id', params.id)
                        .first()
    }

    async store ({ request }) {
        return await Catalogo.create(request.only(['nome']))
    }

    async update ({ request, params }) {
        return Catalogo.query().where('id', params.id).update(request.only(['nome']))
    }

    async destroy ({ params }) {
        return await Catalogo.query().where('id', params.id).delete()
    }
}



module.exports = CatalogoController
