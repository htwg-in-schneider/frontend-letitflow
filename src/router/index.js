import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'
import ContactPage from "@/pages/ContactPage.vue";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.vue";
import ImprintPage from "@/pages/ImprintPage.vue";

import AdminCategoryListPage from '@/pages/AdminCategoryListPage.vue'
import AdminCategoryDetailPage from '@/pages/AdminCategoryDetailPage.vue'
import AdminProductDetailPage from '@/pages/AdminProductDetailPage.vue'

import AdminUserListPage from '@/pages/AdminUserListPage.vue'
import AdminUserDetailPage from '@/pages/AdminUserDetailPage.vue'

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
        path: '/contact',
        name: 'Contact',
        component: ContactPage
    },
    {
        path: '/privacypolicy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicyPage
    },
    {
        path: '/imprintpage',
        name: 'ImprintPage',
        component: ImprintPage
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
  },
  {
    path: '/admin/users',
    name: 'AdminUserList',
    component: AdminUserListPage,
    
  },
{
  path: '/admin/users/:id',
  name: 'AdminUserDetail',
  component: AdminUserDetailPage,
  
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
