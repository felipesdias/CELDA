'use strict'

const User = use('App/Models/User')

class AlunoController {
    async indexAll ({ request }) {
        return await User.query().where('tipo', 'aluno').orderBy('nome').fetch()
    }
}

module.exports = AlunoController
