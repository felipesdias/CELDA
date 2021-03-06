'use strict'

const Atividade = use('App/Models/Atividade')
const Aluno = use('App/Models/User')
const File = use('App/Models/File')
const Drive = use('Drive')
const Helpers = use('Helpers')
const TipoAtividade = use('App/Models/TiposAtividade')

class AtividadeController {

    // TODO definir URL e PATH de arquivos temporarios
    async processaComprovante(aluno, comprovante, destino, comprovanteOld) {
        if(comprovanteOld) {
            await Drive.delete(comprovanteOld.path)
            await comprovanteOld.delete()
        }

        if(!comprovante.id) return;

        if(destino === 'NAO_CONFIRMADO') {
            const newPath = `${Helpers.tmpPath(`alunos\\${aluno.nome} - ${aluno.id}\\not_confirmed`)}\\`
            await Drive.move(`${comprovante.path}${comprovante.nome}`, `${newPath}${comprovante.nome}`, {
                name: comprovante.nome,
                overwrite: true
            })
            comprovante.path = newPath
            comprovante.url = `http://127.0.0.1:8080/alunos/${aluno.nome} - ${aluno.id}/not_confirmed/${comprovante.nome}`
            await comprovante.save()
        } else if(destino === 'CONFIRMADO') {
            const newPath = `${Helpers.tmpPath(`alunos\\${aluno.nome} - ${aluno.id}\\confirmed`)}\\`
            await Drive.move(`${comprovante.path}${comprovante.nome}`, `${newPath}${comprovante.nome}`, {
                name: comprovante.nome,
                overwrite: true
            })
            comprovante.path = newPath
            comprovante.url = `http://127.0.0.1:8080/alunos/${aluno.nome} - ${aluno.id}/confirmed/${comprovante.nome}`
            await comprovante.save()
        }

        comprovante.save();
    }

    async getDados(request, user) {
        let dados

        if(user.tipo === 'aluno') {
            dados = request.only(['catalogo_id', 'tipos_atividade_id', 'nome', 'carga_sugerida'])
            dados.user_id = user.id;
        }
        else if(user.tipo === 'adm') {
            dados = request.only(['catalogo_id', 'user_id', 'tipos_atividade_id', 'nome', 'carga_planejada', 'carga_confirmada'])
        }
        else if(user.tipo === 'aux') {
            dados = request.only(['catalogo_id', 'user_id', 'tipos_atividade_id', 'nome', 'carga_planejada'])
        }

        const tipoAtividade = await TipoAtividade.find(dados.tipos_atividade_id)
        if(dados.carga_confirmada)
            dados.carga_confirmada = Math.min(dados.carga_confirmada, tipoAtividade.max_carga_horaria_atividade)
        if(dados.carga_planejada)
            dados.carga_planejada = Math.min(dados.carga_planejada, tipoAtividade.max_carga_horaria_atividade)
        if(dados.carga_sugerida)
            dados.carga_sugerida = Math.min(dados.carga_sugerida, tipoAtividade.max_carga_horaria_atividade)

        return dados
    }

    async store ({ request, response, auth }) {
        const user = await auth.getUser()
        const dados = await this.getDados(request, user)
        const aluno = await Aluno.find(request.only(['user_id']).user_id)
        const comprovanteDados = request.only(['comprovante']).comprovante
        let comprovante

        if(aluno.finalizado)
            return response.sendStatus({ informar: 'Aluno já foi finalizado!' }, 422)
        
        if(user.tipo === 'aux' && !comprovanteDados)
            return response.sendStatus({ informar: 'O comprovante deve ser anexado!' }, 422)

        if(aluno.old && !dados.carga_planejada)
            return response.sendStatus({ informar: 'Horas planejadas é obigatório!' }, 422)
        
        if(user.tipo === 'aluno' && aluno.id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        if(aluno.old) {
            dados.carga_confirmada = dados.carga_planejada
            dados.carga_planejada = null
            dados.confirmado = true
        }
            
        if(comprovanteDados && comprovanteDados.id) {
            comprovante = await File.find(comprovanteDados.id)

            if(comprovante.user_id !== dados.user_id)
                return response.unauthorized({ message: 'Não autorizado' })
        }

        const atividade = await Atividade.create(dados)

        if(comprovante) {
            comprovante.atividade_id = atividade.id;
            if(aluno.old)
                await this.processaComprovante(aluno, comprovante, 'CONFIRMADO')
            else
                await this.processaComprovante(aluno, comprovante, 'NAO_CONFIRMADO')
        }

        return await Atividade.query().with('comprovante').where('id', atividade.id).first()
    }

    async update ({ request, response, params, auth }) {
        const user = await auth.getUser()
        const dados = await this.getDados(request, user)
        const aluno = await Aluno.find(request.only(['user_id']).user_id)
        const atividade = await Atividade.find(params.id)
        const comprovanteDados = request.only(['comprovante']).comprovante
        let comprovante = null

        if(aluno.finalizado)
            return response.sendStatus({ informar: 'Aluno já foi finalizado!' }, 422)

        if (atividade.confirmado) {
            return response.sendStatus('Você não pode alterar uma atividade confirmada!', 422)
        }

        if(user.tipo === 'aluno' && aluno.id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        if(aluno.old && !dados.carga_planejada)
            return response.sendStatus({ informar: 'Horas planejadas é obigatório!' }, 422)

        if(aluno.old) {
            dados.carga_confirmada = dados.carga_planejada
            dados.carga_planejada = null
            dados.confirmado = true
        }
            
        if(comprovanteDados && comprovanteDados.id) {
            comprovante = await File.find(comprovanteDados.id)

            if(comprovante.user_id !== aluno.id)
                return response.unauthorized({ message: 'Não autorizado' })
        }

        if(comprovante) {
            comprovante.atividade_id = atividade.id;
            const comprovanteOld = await atividade.comprovante().fetch();
            if(aluno.old)
                await this.processaComprovante(aluno, comprovante, 'CONFIRMADO', comprovanteOld)
            else
                await this.processaComprovante(aluno, comprovante, 'NAO_CONFIRMADO', comprovanteOld)
        }
            
        atividade.merge(dados)
        
        await atividade.save()
        
        atividade.comprovante = comprovante

        return atividade
    }

    async destroy ({ params, auth, response }) {
        const atividade = await Atividade.query().with('comprovante').where('id', params.id).first()
        
        const aluno = await Aluno.find(atividade.user_id)
        const user = await auth.getUser()

        if (atividade.confirmado && user.tipo !== 'adm') {
            return response.sendStatus('Você não pode apagar uma atividade confirmada!', 422)
        }

        if(user.tipo === 'aluno' && atividade.user_id !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        await this.processaComprovante(aluno, {}, 'APAGAR', await atividade.comprovante().fecth())

        const deleted = atividade.delete()

        return deleted ? 1 : 0;
    }

    async confirmar ({ params, request, auth }) {
        const user = await auth.getUser()
        const atividade = await Atividade.query().where('id', params.id).first()
        const comprovante = await File.query().where('atividade_id', atividade.id).first()
        const aluno = await Aluno.find(atividade.user_id)

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        if(comprovante) {
            await this.processaComprovante(aluno, comprovante, 'CONFIRMADO')
        }

        atividade.confirmado = true;
        atividade.carga_confirmada = request.only(['horas']).horas
        
        await atividade.save();
        
        atividade.comprovante = comprovante
        
        return atividade;
    }

    async desconfirmar ({ params, auth }) {
        const user = await auth.getUser()
        const atividade = await Atividade.query().where('id', params.id).first()
        const comprovante = await File.query().where('atividade_id', atividade.id).first()
        const aluno = await Aluno.find(atividade.user_id)

        if(user.tipo === 'aux' && !aluno.old)
            return response.unauthorized({ message: 'Não autorizado' })

        if(comprovante) {
            await this.processaComprovante(aluno, comprovante, 'NAO_CONFIRMADO')
        }

        atividade.confirmado = false;
        atividade.carga_confirmada = null
        
        await atividade.save();
        
        atividade.comprovante = comprovante
        
        return atividade;
    }
}

module.exports = AtividadeController
