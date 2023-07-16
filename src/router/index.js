import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/CanvasView.vue'
import CytoscapeView from '../views/CytoscapeView.vue'
import FamilyCytoscapeView from '../views/FamilyCytoscapeView.vue'
import FormBuild from '../views/formBuild.vue'
import TestView from '../views/test.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: CytoscapeView,
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: HomeView,
  },
  {
    path: '/canvas-interaction',
    name: 'CanvasInteraction',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CanvasInteraction.vue'),
  },
  {
    path: '/svg',
    name: 'svg',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SVGView.vue'),
  },
  {
    path: '/vis',
    name: 'vis',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VisView.vue'),
  },
  {
    path: '/cytoscape',
    name: 'cytoscape',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: CytoscapeView,
  },
  {
    path: '/family',
    name: 'family',
    component: FamilyCytoscapeView,
  },
  {
    path: '/formCreate',
    name: 'formCreate',
    component: FormBuild,
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router
