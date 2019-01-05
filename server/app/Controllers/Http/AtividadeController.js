'use strict'

const Atividade = use('App/Models/Atividade')


/*
    Mandar imagem
*/

class AtividadeController {
    async generateUrlFile(dados, atividade = {}) {
        if(atividade.id) {
            if(!dados.newFile && dados.confirmado !== atividade.confirmado) {
                // Trocar de pasta
            }
            else if(dados.newFile) {
                // Deleto o atual
                // Insere no local dados.confirmado
            } else {
                return atividade.comprovante
            }
        }
        else {
            if(!dados.newFile) {
                return null;
            }
            else {
                // Insere no local dados.confirmado
            }
        }

        return null;
    }

    async getDados(request, user) {
        let dados

        if(user.tipo === 'aluno')
            dados = request.only(['catalogo_id', 'user_id', 'tipos_atividade_id', 'nome', 'carga_sugerida', 'newFile'])
        else if(user.tipo === 'adm')
            dados = request.only(['catalogo_id', 'user_id', 'tipos_atividade_id', 'nome', 'carga_planejada', 'carga_confirmada', 'confirmado', 'newFile'])
        else if(user.tipo === 'aux') {
            dados = request.only(['catalogo_id', 'user_id', 'tipos_atividade_id', 'nome', 'carga_confirmada', 'newFile'])
            dados.confirmado = true;
        }

        return dados
    }

    async store ({ request, response, auth }) {
        const user = await auth.getUser()
        const dados = await this.getDados(request, user)
        const atividade = new Atividade()

        if(user.tipo === 'aux' && !dados.newFile)
            return response.sendStatus('O comprovante deve ser anexado!', 422)

        atividade.merge(dados)
        await atividade.save()

        dados.comprovante = await this.generateUrlFile(dados)

        return atividade
    }

    async update ({ request, response, params, auth }) {
        const user = await auth.getUser()
        const dados = await this.getDados(request, user)
        const atividade = Atividade.find(params.id)

        if (atividade.confirmado && user.tipo !== 'adm') {
            return response.sendStatus('Você não pode alterar uma atividade confirmada!', 422)
        }

        dados.comprovante = await this.generateUrlFile(dados, atividade)

        atividade.merge(dados)
        atividade.save()

        return 1
    }

    async destroy ({ params }) {
        const atividade = Atividade.find(params.id)
        const user = await request.auth.getUser()

        if (atividade.confirmado && user.tipo !== 'adm') {
            return response.sendStatus('Você não pode apagar uma atividade confirmada!', 422)
        }

        return await Atividade.query().where('id', params.id).delete()
    }
}

module.exports = AtividadeController
