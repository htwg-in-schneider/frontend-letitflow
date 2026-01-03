import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'

import AdminCategoryListPage from '@/pages/AdminCategoryListPage.vue'
import AdminCategoryDetailPage from '@/pages/AdminCategoryDetailPage.vue'
import AdminProductDetailPage from '@/pages/AdminProductDetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: CategoryPage,
    props: true
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductPage,
    props: true
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResultsPage
  },
  {
    path: '/admin/categories',
    name: 'AdminCategoryList',
    component: AdminCategoryListPage
  },
  {
    path: '/admin/categories/:id',
    name: 'AdminCategoryDetail',
    component: AdminCategoryDetailPage,
    props: true
  },
  {
    path: '/admin/products/:id',
    name: 'AdminProductDetail',
    component: AdminProductDetailPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
