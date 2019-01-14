'use strict'

const Disciplina = use('App/Models/Disciplina')

class DisciplinaController {
    async indexAll() {
        return await Disciplina.all()
    }

    async store ({ request }) {
        return await Disciplina.create(request.only(['catalogo_id', 'nome', 'creditos']))
    }

    async update ({ request, params }) {
        return Disciplina.query().where('id', params.id).update(request.only(['catalogo_id', 'nome', 'creditos']))
    }

    async destroy ({ params }) {
        return await Disciplina.query().where('id', params.id).delete()
    }
}

module.exports = DisciplinaController
