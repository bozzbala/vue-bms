import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/SignupPage.vue'),
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/pages/PostsPage.vue'),
    },
    {
      path: '/posts/create',
      name: 'post-create',
      component: () => import('@/pages/PostCreatePage.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/pages/CategoriesPage.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-show',
      component: () => import('@/pages/PostViewPage.vue'),
      props: true,
    },
    {
      path: '/posts/:id/edit',
      name: 'post-edit',
      component: () => import('@/pages/PostEditPage.vue'),
      props: true,
    },
  ],
})

export default router
