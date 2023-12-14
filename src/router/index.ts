import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import ConnectionView from '../views/ConnectionView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'connection',
    component: ConnectionView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
