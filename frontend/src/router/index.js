import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/pages/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/crear-sesion',
    name: 'CrearSesion',
    component: () => import('@/pages/CrearSession.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // Comprueba si el usuario ha iniciado sesión (simulado con localStorage)
  const loggedIn = localStorage.getItem('user-token');

  // Si la ruta no es '/login' y el usuario no ha iniciado sesión,
  // redirige a '/login'.
  if (to.name !== 'Login' && !loggedIn) {
    next({ name: 'Login' });
  } else {
    next(); // Si todo está bien, permite la navegación.
  }
});

export default router