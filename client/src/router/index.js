import Vue from "vue";
import VueRouter from "vue-router";
import axios from "axios";
import urlAPI from "../config/config.js"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    meta: {
      title: 'Home',
      requiresAuth: true
    }
  },
  {
    path: "/vehiculos",
    name: "Vehiculos",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "vehiculos" */ "../views/Vehiculos.vue"),
    meta: { 
      title: 'Vehiculos',
      requiresAuth: true
     }
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: "/registro",
    name: "Registro",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "registro" */ "../views/Registro.vue"),
      meta: {
        title: 'Registro'
      }
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
      meta: {
        title: 'Repuestos',
        requiresAuth: true
      }
  },
  {
    path: "/clientes",
    name: "Clientes",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "clientes" */ "../views/Clientes.vue"),
      meta: {
        title: 'Clientes',
        requiresAuth: true
      }
  },
  {
    path: "/reservas",
    name: "Reservas",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "reservas" */ "../views/Reservas.vue"),
      meta: {
        title: 'Reservas',
        requiresAuth: true
      }
  },
  {
    path: "/sucursales",
    name: "Sucursales",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sucursales" */ "../views/Sucursales.vue"),
      meta: {
        title: 'Sucursales',
        requiresAuth: true
      }
  },
  {
    path: "/empleados",
    name: "Empleados",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "empleados" */ "../views/Empleados.vue"),
      meta: {
        title: 'Empleados',
        requiresAuth: true
      }
  },
  {
    path: "/turno",
    name: "Reservar Turno",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "turno" */ "../components/Reservas.vue"),
      meta: {
        title: 'Reservar Turno',
        requiresAuth: true
      }
  },
  {
    path: "/servicios",
    name: "Servicios",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "servicios" */ "../views/Servicios.vue"),
      meta: {
        title: 'Servicios',
        requiresAuth: true
      }
  },
  {
    path: "/mails",
    name: "Mails",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "servicios" */ "../views/Mails.vue"),
      meta: {
        title: 'Configuración Mails',
        requiresAuth: true
      }
  },
  {
    path: "/ventas",
    name: "Ventas",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ventas" */ "../views/Ventas.vue"),
      meta: {
        title: 'Ventas',
        requiresAuth: true
      }
  },
  {
    path: "/pagos",
    name: "Pagos",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "pagos" */ "../views/Pagos.vue"),
      meta: {
        title: 'Pagos',
        requiresAuth: true
      }
  },
  {
    path: "/ventasRealizadas",
    name: "VentasRealizadas",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ventasRealizadas" */ "../views/VentasRealizadas.vue"),
      meta: {
        title: 'Ventas Realizadas',
        requiresAuth: true
      }
  },
  {
    path: "/proveedores",
    name: "Proveedores",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "proveedores" */ "../views/Proveedores.vue"),
      meta: {
        title: 'Proveedores',
        requiresAuth: true
      }
  },
  {
    path: "/documentacion",
    name: "Documentación",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "documentacion" */ "../components/Documentacion.vue"),
      meta: {
        title: 'Documentación',
        requiresAuth: true
      }
  },
  
  {
    path: "/entregas",
    name: "Entregas",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "entregas" */ "../views/Entregas.vue"),
      meta: {
        title: 'Entregas',
        requiresAuth: true
      }
  },
  {
    path: "/caja",
    name: "Caja",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "caja" */ "../views/Caja.vue"),
      meta: {
        title: 'Caja',
        requiresAuth: true
      }
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
router.beforeEach((to, from, next) => {
      axios.get(urlAPI + 'getinfo',{
        "headers":{
          "token": localStorage.getItem('token')
        }
      })
      .then(() => {
        localStorage.setItem('logged',true)
      })
      .catch(() => {
        localStorage.setItem('logged',false)
      })

      if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (localStorage.getItem('logged') != "true") {
          next({ name: 'Login' })
        } else {
          next() // go to wherever I'm going
        }
      } else {
        next() // does not require auth, make sure to always call next()!
      }

    })

export default router;
