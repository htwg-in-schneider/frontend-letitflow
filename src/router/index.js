// src/router/index.js
import {createRouter, createWebHistory} from 'vue-router'

// deine Seiten
import HomePage from '@/pages/HomePage.vue'

import CartPage from '@/pages/CartPage.vue'
import CategoryPage from "@/pages/CategoryPage.vue";
import ProductPage from "@/pages/ProductPage.vue";


const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/cart',
        name: 'cart',
        component: CartPage,
    },
    {
        path: '/category/:id',
        name: 'category',
        component: CategoryPage,
    },
    {path: '/product/:id',
        name: 'product',
        component: ProductPage}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
