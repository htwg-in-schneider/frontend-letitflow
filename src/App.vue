<script setup>
import Navbar from "@/components/Navbar.vue";
import PageFooter from "@/components/PageFooter.vue";
</script>

<template>
  <Navbar/>

  <div class="app-content">
    <router-view/>
  </div>

  <PageFooter/>
</template>

<style>
/* Sicherstellen, dass der Content-Bereich 
  kein "overflow: hidden" hat, da dies 
  Sticky-Elemente in den Unterseiten deaktiviert.
*/
.app-content {
  display: block;
  width: 100%;
}
</style>