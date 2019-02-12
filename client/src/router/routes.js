const routes = [
    {
        path: '/',
        component: () => import('layouts/Celda-Layout'),
        meta: { auth: true },
        children: [
            {
                path: '/alunos',
                name: 'alunos',
                meta: { can: 'adm,aux' },
                component: () => import('pages/Alunos.vue'),
            },
            {
                path: '/detalheAluno/:alunoId',
                name: 'detalheAluno',
                meta: { can: 'adm,aluno,aux' },
                component: () => import('pages/DetalheAluno.vue'),
            },
            {
                path: '/catalogos',
                name: 'catalogos',
                meta: { can: 'adm' },
                component: () => import('pages/Catalogos.vue'),
            },
            {
                path: '/detalheCatalogo/:catalogoId',
                name: 'detalheCatalogo',
                meta: { can: 'adm' },
                component: () => import('pages/DetalheCatalogo.vue'),
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('pages/Login2.vue'),
    },

];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue'),
    });
}

export default routes;
