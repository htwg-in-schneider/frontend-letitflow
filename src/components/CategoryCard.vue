<template>
  <div class="border border-[#f0c9b8] bg-white flex flex-col">
    <img
        :src="imageSrc"
        :alt="title"
        class="w-full object-cover aspect-[4/3]"
    />

    <div class="flex-1 flex flex-col justify-between px-4 py-4">
      <h3 class="font-semibold text-lg leading-snug mb-4">
        {{ title }}
      </h3>

      <div class="mt-auto">
        <router-link
            :to="`/category/${link}`"
            class="inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium text-white bg-[#e09a82]"
        >
          {{ buttonText }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  imageSrc: String,
  buttonText: {
    type: String,
    default: 'jetzt entdecken'
  }, link: String
})
</script>
