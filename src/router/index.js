import Vue from 'vue'
import VueRouter from 'vue-router'
import global from '../views/layout/global'
import Index from '../views/Index'
import Create from '../views/post/Create'
import Detail from '../views/post/Detail'
import Search from '../views/post/Search'
import Profile from '../views/user/Profile'

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
      { path: 'create', name: 'post-create', component: Create },
      { path: 'detail/:id', name: 'post-detail', component: Detail },
      { path: 'search/:keywords', name: 'post-search', component: Search }
    ]
  },
  {
    path: '/user',
    component: global,
    children: [
      { path: 'profile/:id', name: 'user-profile', component: Profile }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
