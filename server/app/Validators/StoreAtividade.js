'use strict'

class StoreAtividade {
  get rules () {
    return {
        catalogo_id: 'required|integer',
        user_id: 'required|integer',
        tipos_atividade_id: 'required|integer',
        nome: 'required|string|max:190',
        carga_sugerida: 'integer',
        carga_planejada: 'integer',
        carga_confirmada: 'integer',
        confirmado: 'boolean'
    }
  }
}

module.exports = StoreAtividade
