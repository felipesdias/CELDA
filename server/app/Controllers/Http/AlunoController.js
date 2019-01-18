'use strict'

const User = use('App/Models/User')
const Atividade = use('App/Models/Atividade')
const TipoAtividade = use('App/Models/TiposAtividade')
const Disciplina = use('App/Models/Disciplina')
const File = use('App/Models/File')
const Helpers = use('Helpers')
const Drive = use('Drive')

const moment = require('moment')
const PdfBase = require('pdfmake');

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

        if(user.tipo === 'aluno' && parseInt(params.id, 10) !== user.id)
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

        if(user.tipo === 'aluno' && parseInt(params.id, 10) !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        const query = User.query().where('id', params.id)
        if(user.tipo === 'aux')
            query.where('old', true)

        await query.update({ catalogo_id: request.only(['catalogo_id']).catalogo_id })

        return await this.index({ params, auth, response });
    }

    async matricular({ params, auth, response }) {
        const user = await auth.getUser()

        if(user.tipo === 'aluno' && parseInt(params.id, 10) !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        const aluno = await User.find(params.id)
        await aluno.disciplinas().attach([params.discId])

        return true
    }

    async desmatricular({ params, auth, response }) {
        const user = await auth.getUser()

        if(user.tipo === 'aluno' && parseInt(params.id, 10) !== user.id)
            return response.unauthorized({ message: 'Não autorizado' })

        const aluno = await User.find(params.id)
        await aluno.disciplinas().detach([params.discId])

        return true
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

        const nome = this.generateFileName(params.id, arquivo.extname)

        // TODO definir URL e PATH de arquivos temporarios
        const file_propriedades = {
            nome,
            path: `${Helpers.tmpPath('uploads')}\\`,
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

    async finalizar({ params, request }) {
        const aluno = await User.find(params.id)
        const finalizado = request.only(['finalizado']).finalizado
        
        if(finalizado)
            await this.geraPdf(parseInt(params.id, 10))

        return await User.query().where('id', params.id).update({ finalizado })
    }

    async geraPdf(alunoId) {
        const aluno = await User.query()
                            .with('disciplinas')
                            .with('catalogo')
                            .where('id', alunoId)
                            .first()

        aluno.atividadesS = await Atividade.query()
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

        const fonts = {
            Roboto: {
                normal: './fonts/Roboto-Regular.ttf',
                bold: './fonts/Roboto-Medium.ttf',
                italics: './fonts/Roboto-Italic.ttf',
                bolditalics: './fonts/Roboto-MediumItalic.ttf'
            }
        };
        
        const PdfPrinter = require('pdfmake/src/printer');
        const pdfmake = new PdfPrinter(fonts)
        const fs = require('fs');
        
        const docDefinition = {
            content: [
                { text: 'Relatório de lançamento de atividades', style: 'header' },
                `Este documento é referente as atividades do aluno ${aluno.nome} portador da matrícula ${aluno.matricula}.`,
                { text: `Gerado em ${moment().format('DD/MM/YYYY')} as ${moment().format('HH:mm')} horas.`, style: 'espaco' },
            ],
            styles: {
                espaco: {
                    margin: [0, 0, 0, 30]
                },
                header: {
                    fontSize: 17,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    margin: [0, 0, 0, 5]
                },
                tableStyle: {
                    margin: [0, 5, 0, 30]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black'
                }
            },
            defaultStyle: {
                fontSize: 10,
            }
        };

        let totalGeral = 0
        
        aluno.tiposAtividades.toJSON().forEach(tipoAtividade => {
            docDefinition.content.push({text: tipoAtividade.nome, style: 'subheader'})
            docDefinition.content.push(tipoAtividade.descricao)
            let total = 0
            const tabela = {
                style: 'tableStyle',
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto'],
                    body: [
                        [{ text: 'Nome', style: 'tableHeader' }, { text: 'Arquivo', style: 'tableHeader' }, { text: 'Horas', style: 'tableHeader' }],
                    ],
                },
                layout: 'lightHorizontalLines'
            }
            aluno.atividadesS.toJSON().filter(item => item.tipos_atividade_id === tipoAtividade.id && item.confirmado).forEach(atividade => {
                tabela.table.body.push([atividade.nome, (atividade.comprovante || {}).nome || '-', `${atividade.carga_confirmada}`])
                total += atividade.carga_confirmada
            })
            tabela.table.body.push(['TOTAL', '-', `${total}`])
            totalGeral += total
            docDefinition.content.push(tabela)
        })

        docDefinition.content.push(`Total de horas: ${totalGeral}`)

        const pdf = await pdfmake.createPdfKitDocument(docDefinition);

        const path = `${Helpers.tmpPath(`alunos\\${aluno.nome} - ${aluno.id}`)}`
        
        try {
            if(await Drive.exists(path)) {
                await pdf.pipe(fs.createWriteStream(`${path}\\Relatório.pdf`), { encoding:'utf16' });
                await pdf.end();
            }
        } catch(e) {
        }
    }
}

module.exports = AlunoController
