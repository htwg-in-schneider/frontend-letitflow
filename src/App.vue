<script setup>
import { watch, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStores';
import Navbar from "@/components/Navbar.vue";
import PageFooter from "@/components/PageFooter.vue";

const auth0 = useAuth0();
const router = useRouter();
const cartStore = useCartStore();

// 1. Sicherheit für den Login-Redirect
watch(
  () => (auth0 && auth0.appState) ? auth0.appState.value : null,
  (targetState) => {
    if (targetState?.target) {
      router.push(targetState.target);
    }
  }
);

// 2. Sobald Auth0 bereit ist oder der User-Status sich ändert: Store updaten
watch(
  () => auth0.isAuthenticated.value,
  (isLoggedIn) => {
    if (isLoggedIn && auth0.user.value) {
      cartStore.setUserId(auth0.user.value.sub);
    } else {
      cartStore.setUserId(null);
    }
    cartStore.loadCart();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <router-view class="flex-grow" />
    <PageFooter />
  </div>
</template>