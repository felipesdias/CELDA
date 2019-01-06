
const routes = [
    {
        path: 'celda',
        component: () => import('layouts/Celda-Layout'),
        meta: { auth: true },
        children: [

        ]
    },
    {
        path: '/',
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
