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
  async handle ({ response, auth }, next, properties) {
    const user = await auth.getUser()
    if (properties.findIndex(x => x === user.tipo) === -1) {
        response.unauthorized({ message: 'Não autorizado' })
    } else {
        // call next to advance the request
        await next()
    }
  }
}

module.exports = CanAccess
