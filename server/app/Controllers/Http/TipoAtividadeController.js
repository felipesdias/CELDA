'use strict'

const TiposAtividade = use('App/Models/TiposAtividade')

class TipoAtividadeController {
    async store ({ request }) {
        return await TiposAtividade.create(request.only(['catalogo_id', 'nome', 'descricao', 'ordem', 'max_carga_horaria', 'max_carga_horaria_atividade']))
    }

    async update ({ request, params }) {
        return TiposAtividade.query().where('id', params.id).update(request.only(['catalogo_id', 'nome', 'descricao', 'ordem', 'max_carga_horaria', 'max_carga_horaria_atividade']))
    }

    async destroy ({ params }) {
        return await TiposAtividade.query().where('id', params.id).delete()
    }
}

module.exports = TipoAtividadeController
