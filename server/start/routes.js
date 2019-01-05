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

Route.group(() => {
    Route.put('/atividade/:id', 'AtividadeController.update').validator('StoreAtividade')
    Route.delete('/atividade/:id', 'AtividadeController.destroy').validator('StoreAtividade')
}).middleware(['auth', 'canAccess:adm,aluno'])

Route.group(() => {
    Route.post('/atividade', 'AtividadeController.store').validator('StoreAtividade')
}).middleware(['auth', 'canAccess:adm,aluno,aux'])

Route.group(() => {
    Route.put('/catalogo/:id', 'CatalogoController.update').validator('StoreCatalogo')
    Route.post('/catalogo', 'CatalogoController.store').validator('StoreCatalogo')
    Route.delete('/catalogo/:id', 'CatalogoController.destroy')

    Route.put('/tipoAtividade/:id', 'TipoAtividadeController.update').validator('StoreTipoAtividade')
    Route.post('/tipoAtividade', 'TipoAtividadeController.store').validator('StoreTipoAtividade')
    Route.delete('/tipoAtividade/:id', 'TipoAtividadeController.destroy')

    Route.put('/disciplina/:id', 'DisciplinaController.update').validator('StoreDisciplina')
    Route.post('/disciplina', 'DisciplinaController.store').validator('StoreDisciplina')
    Route.delete('/disciplina/:id', 'DisciplinaController.destroy')
}).middleware(['auth', 'canAccess:admin'])


Route.post('/login', 'UserController.login').middleware('guest')
Route.post('/createUser', 'UserController.createUser').middleware('guest')
