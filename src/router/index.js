import Vue from 'vue'
import VueRouter from 'vue-router'
import global from '../views/layout/global'
import Index from '../views/Index'
import Create from '../views/post/Create'
//
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: global,
    component: global,
    children: [
      { path: '', name: 'Default', component: Index }
    ]
  },
  {
    path: '/post',
    component: global,
    children: [
      { path: 'create', name: 'post-create', component: Create }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
