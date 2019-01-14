'use strict'

const User = use('App/Models/User')
const Catalogo = use('App/Models/Catalogo')

class UserController {
  // TODO definir sistema de login
  async login ({ request, auth }) {
    const user = await User.findBy('matricula', request.post().matricula)
    user.catalogo = await user.catalogo().fetch()
    const resposta = await auth.generate(user)
    resposta.user = user
    return resposta
  }
}

module.exports = UserController
