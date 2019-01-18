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
    Route.put('/catalogo/:id', 'CatalogoController.update').validator('StoreCatalogo')
    Route.post('/catalogo', 'CatalogoController.store').validator('StoreCatalogo')
    Route.delete('/catalogo/:id', 'CatalogoController.destroy')

    Route.put('/tipoAtividade/:id', 'TipoAtividadeController.update').validator('StoreTipoAtividade')
    Route.post('/tipoAtividade', 'TipoAtividadeController.store').validator('StoreTipoAtividade')
    Route.delete('/tipoAtividade/:id', 'TipoAtividadeController.destroy')

    Route.put('/disciplina/:id', 'DisciplinaController.update').validator('StoreDisciplina')
    Route.post('/disciplina', 'DisciplinaController.store').validator('StoreDisciplina')
    Route.delete('/disciplina/:id', 'DisciplinaController.destroy')

    Route.put('aluno/:id/finalizar', 'AlunoController.finalizar')
}).middleware(['auth', 'canAccess:adm'])

Route.group(() => {
    Route.get('/aluno', 'AlunoController.indexAll')
    Route.post('/aluno', 'AlunoController.store').validator('StoreAluno')
    Route.put('/atividade/:id/confirma', 'AtividadeController.confirmar')
    Route.put('/atividade/:id/desconfirma', 'AtividadeController.desconfirmar')
}).middleware(['auth', 'canAccess:adm,aux'])

Route.group(() => {
    Route.put('/atividade/:id', 'AtividadeController.update').validator('StoreAtividade')
    Route.delete('/atividade/:id', 'AtividadeController.destroy')
    Route.post('/atividade', 'AtividadeController.store').validator('StoreAtividade')
    Route.get('/catalogo', 'CatalogoController.indexAll')
    Route.get('/catalogo/:id', 'CatalogoController.index')
    Route.put('/aluno/:id/catalogo', 'AlunoController.changeCatalogo')
    Route.post('/file/:id', 'AlunoController.uploadFile')
    Route.get('/aluno/:id', 'AlunoController.index')

    Route.get('/aluno/:id/disciplina/:discId/matricular', 'AlunoController.matricular')
    Route.get('/aluno/:id/disciplina/:discId/desmatricular', 'AlunoController.desmatricular')
}).middleware(['auth', 'canAccess:adm,aluno,aux'])

Route.post('/login', 'UserController.login')
