import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import('../views/HomeView.vue')
    }
  },
  {
    path: '/boot',
    name: 'boot',
    component: function () {
      return import('../views/BootView.vue')
    }
  },
  {
    path: '/patch',
    name: 'patch',
    component: function () {
      return import('../views/PatchView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
