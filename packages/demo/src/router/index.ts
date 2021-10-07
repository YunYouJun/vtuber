import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'pages-generated'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
