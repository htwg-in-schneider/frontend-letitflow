<script setup>
import HeaderSection from './components/HeaderSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import PageFooter from './components/PageFooter.vue'
</script>

<template>
  <div class="page">
    <HeaderSection />

    <main>
      <ProductsSection />
    </main>

    <PageFooter />
  </div>
</template>

<style scoped>
/* Optional: App-spezifische Styles */
</style>
