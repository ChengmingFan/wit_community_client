import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from '../App'
import global from '../views/layout/global'
import Index from '../views/Index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: global
    // component: global,
    // children: [
    //   { path: '/popular', name: 'Default', component: PostArea }
    // ]
  },
  {
    path: '/homepage',
    component: Index
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
