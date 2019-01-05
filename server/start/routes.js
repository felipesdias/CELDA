'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('/teste', 'UserController.teste').middleware('auth')

Route.post('/catalogo/create', 'CatalogoController.create').middleware('auth').validator('StoreCatalogo')

Route.post('/login', 'UserController.login').middleware('guest')
Route.post('/createUser', 'UserController.createUser').middleware('guest')
