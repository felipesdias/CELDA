const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Response = use('Adonis/Src/Response')

  Response.macro('sendStatus', function (message, status) {
    this.status(status).send(message)
  })
})