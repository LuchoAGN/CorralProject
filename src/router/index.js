import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginCorral from '../views/LoginCorral.vue'

Vue.use(VueRouter)

const guest = (to, from, next) => {

  if (!localStorage.getItem('user')) {
    return next()
  } else {
    return next('/')
  }
}

const auth = (to, from, next) => {
  if (localStorage.getItem('user')) {
    return next()
  } else {
    return next('/login')
  }
}


const routes = [
  {
    path: '/login',
    name: 'LoginCorral',
    beforeEnter: guest,
    component: LoginCorral
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: auth
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
