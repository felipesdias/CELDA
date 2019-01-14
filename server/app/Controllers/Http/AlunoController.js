'use strict'

const User = use('App/Models/User')
const Atividade = use('App/Models/Atividade')
const TipoAtividade = use('App/Models/TiposAtividade')
const Disciplina = use('App/Models/Disciplina')
const File = use('App/Models/File')
const Helpers = use('Helpers')

const moment = require('moment')

class AlunoController {
    async indexAll ({ auth }) {
        const user = await auth.getUser()
        const query = User.query().where('tipo', 'aluno')
        if(user.tipo === 'aux')
            query.where('old', true)
        return await query.orderBy('nome').fetch()
    }

    async index ({ params, auth, response }) {
        const user = await auth.getUser()

        if(user.tipo === 'aluno' && params.id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        let aluno = User.query()
                            .with('disciplinas')
                            .with('catalogo')
                            .where('id', params.id)

        if(user.tipo === 'aux')
            aluno = aluno.where('old', true)

        aluno = await aluno.first()

        aluno.atividades = await Atividade.query()
                                            .with('comprovante')
                                            .where('user_id', aluno.id)
                                            .where('catalogo_id', aluno.catalogo_id)
                                            .fetch()

        aluno.tiposDisciplinas = await Disciplina.query()
                                            .where('catalogo_id', aluno.catalogo_id)
                                            .fetch()

        aluno.tiposAtividades = await TipoAtividade.query()
                                            .where('catalogo_id', aluno.catalogo_id)
                                            .fetch()
        return aluno
    }

    async store ({ request }) {
        const dados = request.only(['email', 'matricula', 'nome', 'catalogo_id'])
        dados.tipo = 'aluno';
        dados.old = true;

        const aluno = await User.create(dados)

        aluno.tiposAtividades = await TipoAtividade.query()
                                            .where('catalogo_id', aluno.catalogo_id)
                                            .fetch()

        return aluno;
    }

    async changeCatalogo({ params, auth, response, request }) {
        const user = await auth.getUser()

        if(user.tipo === 'aluno' && params.id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        const query = User.query().where('id', params.id)
        if(user.tipo === 'aux')
            query.where('old', true)

        await query.update({ catalogo_id: request.only(['catalogo_id']).catalogo_id })

        return await this.index({ params, auth, response });
    }

    generateFileName(id, ext) {
        return `${id}_${moment().format('YYYY-MM-DD')}_${moment().valueOf()}_${Math.random().toString(36).substring(7)}.${ext}`
    }

    async uploadFile({ params, auth, response, request }) {
        const user = await auth.getUser();
        const aluno = await User.find(params.id)

        if(user.tipo === 'aluno' && aluno.id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        const arquivo = request.file('file', {
            types: ['image', 'pdf'],
        })

        // TODO definir URL e PATH de arquivos temporarios
        const file_propriedades = {
            nome: this.generateFileName(params.id, arquivo.extname),
            path: Helpers.tmpPath('uploads'),
            url: 'aaaaa',
            user_id: params.id
        }
        
        await arquivo.move(file_propriedades.path, {
            name: file_propriedades.nome,
            overwrite: true
        })
        
        if (!arquivo.moved()) {
            return response.sendStatus(arquivo.error(), 422)
        }

        return response.sendStatus(await File.create(file_propriedades), 200)
    }
}

module.exports = AlunoController
