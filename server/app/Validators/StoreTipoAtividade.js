'use strict'

class StoreTipoAtividade {
    get rules () {
        return {
            catalogo_id: 'required|integer',
            nome: 'required|string|max:300',
            descricao: 'required|string|max:1000',
            ordem: 'required|integer',
            max_carga_horaria: 'required|integer',
            max_carga_horaria_atividade: 'required|integer',
        }
    }
}

module.exports = StoreTipoAtividade
