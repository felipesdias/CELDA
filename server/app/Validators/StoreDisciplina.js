'use strict'

class StoreDisciplina {
    get rules () {
        return {
            catalogo_id: 'required|integer',
            nome: 'required|string|max:45',
            creditos: 'required|integer',
        }
    }
}

module.exports = StoreDisciplina
