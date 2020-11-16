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
    path: "/proveedores",
    name: "Proveedores",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "proveedores" */ "../views/Proveedores.vue"),
    meta: { title: 'Proveedores' }
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
