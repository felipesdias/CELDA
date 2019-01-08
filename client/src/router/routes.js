
const routes = [
    {
        path: '/',
        component: () => import('layouts/Celda-Layout'),
        meta: { auth: true },
        children: [
            {
                path: '/alunos',
                name: 'alunos',
                component: () => import('pages/Alunos.vue'),
            },
            {
                path: '/detalheAluno/:alunoId',
                name: 'detalheAluno',
                component: () => import('pages/DetalheAluno.vue'),
            },
            {
                path: '/catalogos',
                name: 'catalogos',
                component: () => import('pages/Catalogos.vue'),
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('pages/Login.vue'),
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
