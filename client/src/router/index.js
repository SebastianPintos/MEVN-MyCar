import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/vehiculos",
    name: "Vehiculos",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "vehiculos" */ "../views/Vehiculos.vue"),
    meta: { title: 'Vehiculos' }
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: { title: 'Login' }
  },
  {
    path: "/registro",
    name: "Registro",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "registro" */ "../views/Registro.vue"),
    meta: { title: 'Registro' }
  }
  ,
  {
    path: "/repuestos",
    name: "Repuestos",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "repuestosVista" */ "../views/Repuestos.vue"),
    meta: { title: 'Repuestos' }
  },
  {
    path: "/clientes",
    name: "Clientes",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "clientes" */ "../views/Clientes.vue"),
    meta: { title: 'Clientes' }
  },
  {
    path: "/reservas",
    name: "Reservas",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "reservas" */ "../views/Reservas.vue"),
    meta: { title: 'Reservas' }
  },
  {
    path: "/sucursales",
    name: "Sucursales",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sucursales" */ "../views/Sucursales.vue"),
    meta: { title: 'Sucursales' }
  },
  {
    path: "/empleados",
    name: "Empleados",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "empleados" */ "../views/Empleados.vue"),
    meta: { title: 'Empleados' }
  },
  {
    path: "/turno",
    name: "Reservar Turno",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "turno" */ "../components/Reservas.vue"),
    meta: { title: 'Reservar Turno' }
  },
  {
    path: "/servicios",
    name: "Servicios",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "servicios" */ "../views/Servicios.vue"),
    meta: { title: 'Servicios' }
  },
  {
    path: "/mails",
    name: "Mails",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "servicios" */ "../views/Mails.vue"),
    meta: { title: 'Configuración Mails' }
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

const DEFAULT_TITLE = 'My Car - Home';
router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || DEFAULT_TITLE;
    });
});

export default router;
