<script setup>
import {watch, onMounted, ref} from 'vue';
import {useAuth0} from '@auth0/auth0-vue';
import {useRouter} from 'vue-router';
import {useCartStore} from '@/stores/cartStores';
import {useToast} from '@/composables/useToast';
import Navbar from "@/components/Navbar.vue";
import PageFooter from "@/components/PageFooter.vue";
import Toast from "@/components/Toast.vue";

const auth0 = useAuth0();
const router = useRouter();
const cartStore = useCartStore();
const toastComponent = ref(null);
const {setComponent} = useToast();

onMounted(() => {
  if (toastComponent.value) {
    setComponent(toastComponent.value);
  }
});

watch(
    () => (auth0 && auth0.appState) ? auth0.appState.value : null,
    (targetState) => {
      if (targetState?.target) {
        router.push(targetState.target);
      } 
    }
);

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
    {immediate: true}
);
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar/>
    <router-view class="flex-grow"/>
    <PageFooter/>
    <Toast ref="toastComponent"/>
  </div>
</template>