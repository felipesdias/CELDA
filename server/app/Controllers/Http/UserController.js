'use strict'

const User = use('App/Models/User')
const Catalogo = use('App/Models/Catalogo')

class UserController {
  async login ({ request, auth }) {
    const user = await User.findBy('matricula', request.post().matricula)
    user.catalogo = await user.catalogo().fetch()
    const resposta = await auth.generate(user)
    resposta.user = user
    return resposta
  }

  async teste ({ request, auth }) {
    const user = await auth.getUser()
    return await user.tokens().fetch()
  }

  async createUser ({ request }) {
    Catalogo.findOrCreate({ id: 1 }, { id: 1, nome: 'Teste' })
    const userData = request.only(['username', 'email', 'matricula', 'nome', 'password'])
    userData.catalogo_id = 1
    userData.tipo = 'aluno'
    const user = await User.create(userData)

    return user
  }
}

module.exports = UserController
