import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'
import ContactPage from "@/pages/ContactPage.vue";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.vue";
import ImprintPage from "@/pages/ImprintPage.vue";

import LoginView from "@/pages/LoginView.vue";
import LogoutView from "@/pages/LogoutView.vue";
import UserView from "@/pages/UserView.vue";

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
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/logout',
        name: 'Logout',
        component: LogoutView
    },
    {
        path: '/user',
        name: 'User',
        component: UserView
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
