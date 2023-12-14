import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import ConnectionView from '../views/ConnectionView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'connection',
    component: ConnectionView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
