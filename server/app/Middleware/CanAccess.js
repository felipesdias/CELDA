'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CanAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth, params }, next, properties) {
    const user = await auth.getUser()
    if (!properties.includes(user.tipo)) {
        response.unauthorized({ message: 'Não autorizado' })
    } else {
        await next()
    }
  }
}

module.exports = CanAccess
