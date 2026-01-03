import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'
import ContactPage from "@/pages/ContactPage.vue";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.vue";
import ImprintPage from "@/pages/ImprintPage.vue";
import AccountPage from "@/pages/AccountPage.vue";

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
        path: '/account',
        name: 'Account',
        component: AccountPage
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
