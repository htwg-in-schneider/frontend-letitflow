import {createRouter, createWebHashHistory} from 'vue-router'
import {authGuard} from '@auth0/auth0-vue'

import HomePage from '@/pages/HomePage.vue'
import CategoryPage from '@/pages/CategoryPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import SearchResultsPage from '@/pages/SearchResultsPage.vue'
import ContactPage from "@/pages/ContactPage.vue";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.vue";
import ImprintPage from "@/pages/ImprintPage.vue";
import AboutUsPage from "@/pages/AboutUsPage.vue";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage.vue";
import PaymentMethodsPage from "@/pages/PaymentMethodsPage.vue";
import ShippingInfoPage from "@/pages/ShippingInfoPage.vue";
import ReturnsPage from "@/pages/ReturnsPage.vue";

import LoginView from "@/pages/LoginView.vue";
import LogoutView from "@/pages/LogoutView.vue";


import AdminCategoryListPage from '@/pages/AdminCategoryListPage.vue'
import AdminCategoryDetailPage from '@/pages/AdminCategoryDetailPage.vue'
import AdminProductListPage from '@/pages/AdminProductListPage.vue'
import AdminProductDetailPage from '@/pages/AdminProductDetailPage.vue'
import AdminOrderListPage from '@/pages/AdminOrderListPage.vue'

import AdminUserListPage from '@/pages/AdminUserListPage.vue'
import AdminUserDetailPage from '@/pages/AdminUserDetailPage.vue'

import CardView from '@/pages/CardView.vue'
import OrderView from '@/pages/OrderView.vue'
import OrderListPage from '@/pages/OrderListPage.vue'
import OrderDetailPage from '@/pages/OrderDetailPage.vue'

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
        path: '/about',
        name: 'AboutUs',
        component: AboutUsPage
    },
    {
        path: '/agb',
        name: 'TermsAndConditions',
        component: TermsAndConditionsPage
    },
    {
        path: '/payment-methods',
        name: 'PaymentMethods',
        component: PaymentMethodsPage
    },
    {
        path: '/shipping-info',
        name: 'ShippingInfo',
        component: ShippingInfoPage
    },
    {
        path: '/returns',
        name: 'Returns',
        component: ReturnsPage
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
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/ProfileView.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/admin/categories',
        name: 'AdminCategoryList',
        component: AdminCategoryListPage,
        beforeEnter: authGuard
    },
    {
        path: '/admin/categories/:id',
        name: 'AdminCategoryDetail',
        component: AdminCategoryDetailPage,
        props: true,
        beforeEnter: authGuard
    },
    {
        path: '/admin/products',
        name: 'AdminProductList',
        component: AdminProductListPage,
        beforeEnter: authGuard
    },
    {
        path: '/admin/products/:id',
        name: 'AdminProductDetail',
        component: AdminProductDetailPage,
        props: true,
        beforeEnter: authGuard
    },
    {
        path: '/admin/orders',
        name: 'AdminOrderList',
        component: AdminOrderListPage,
        beforeEnter: authGuard
    },
    {
        path: '/admin/users',
        name: 'AdminUserList',
        component: AdminUserListPage,
        beforeEnter: authGuard
    },
    {
        path: '/admin/users/:id',
        name: 'AdminUserDetail',
        component: AdminUserDetailPage,
        beforeEnter: authGuard
    },
    {
        path: '/cartView',
        name: 'CartView',
        component: CardView
    },
    {
        path: '/orderView',
        name: 'OrderView',
        component: OrderView,
        beforeEnter: authGuard
    },
    {
        path: '/orders',
        name: 'OrderList',
        component: OrderListPage,
        beforeEnter: authGuard
    },
    {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: OrderDetailPage,
        props: true,
        beforeEnter: authGuard
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router