<template>
  <div class="border border-[#f0c9b8] bg-white rounded-md shadow-sm">
    <div class="flex flex-col md:flex-row gap-4 p-4">
        
      <slot name="left" />

      <div class="flex-1 flex flex-col gap-3">
        <slot name="fields" />

        <div class="mt-2 flex justify-between gap-2">
          <slot name="leftActions" />
          <slot name="rightActions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
