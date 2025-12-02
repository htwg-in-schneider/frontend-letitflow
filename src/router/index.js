// src/router/index.js
import {createRouter, createWebHistory} from 'vue-router'

// deine Seiten
import HomePage from '@/pages/HomePage.vue'

import CartPage from '@/pages/CartPage.vue'
import CategoryPage from "@/pages/CategoryPage.vue";


const routes = [
    {
        path: '/',            // http://localhost:5173/
        name: 'home',
        component: HomePage,
    },
    {
        path: '/cart',        // http://localhost:5173/cart
        name: 'cart',
        component: CartPage,
    },
    {
        path: '/category/:id',
        name: 'category',
        component: CategoryPage,
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
