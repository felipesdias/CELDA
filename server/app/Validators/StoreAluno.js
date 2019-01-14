'use strict'

class StoreAluno {
    get rules () {
        return {
            nome: 'required|string',
            email: 'required|email',
            matricula: 'required|string',
            catalogo_id: 'required'
        }
      }
}

module.exports = StoreAluno
