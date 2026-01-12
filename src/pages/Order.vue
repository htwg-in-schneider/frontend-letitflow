<template>
  <div class="bg-white border border-orange-100 p-6 rounded-xl shadow-sm">
    <h3 class="text-lg font-bold mb-4 text-gray-800">{{ title }}</h3>

    <div v-if="addressExists && !isEditing" class="space-y-2 text-gray-600">
      <p class="font-medium text-black">{{ address.firstName }} {{ address.lastName }}</p>
      <p>{{ address.street }} {{ address.houseNumber }}</p>
      <p>{{ address.postalCode }} {{ address.city }}</p>
      <p>{{ address.country }}</p>
      
      <button @click="isEditing = true" class="mt-4 text-[#e09a82] hover:underline text-sm font-medium">
        Adresse bearbeiten
      </button>
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-3">
      <div class="grid grid-cols-2 gap-2">
        <input v-model="address.firstName" placeholder="Vorname" class="border p-2 rounded w-full text-sm" required>
        <input v-model="address.lastName" placeholder="Nachname" class="border p-2 rounded w-full text-sm" required>
      </div>
      <input v-model="address.street" placeholder="Straße & Hausnummer" class="border p-2 rounded w-full text-sm" required>
      <input v-model="address.houseNumber" placeholder="Hausnummer" class="border p-2 rounded w-full text-sm" required>
      <div class="grid grid-cols-3 gap-2">
        <input v-model="address.postalCode" placeholder="PLZ" class="border p-2 rounded w-full text-sm" required>
        <input v-model="address.city" placeholder="Stadt" class="border p-2 rounded col-span-2 w-full text-sm" required>
        <input v-model="address.country" placeholder="Land" class="border p-2 rounded w-full text-sm" required>
    </div>
      <button type="submit" class="w-full bg-[#e09a82] text-white py-2 rounded-lg text-sm hover:bg-[#d48366]">
        Adresse speichern
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAddressByUserAndType, saveAddress } from '@/api/api.js';

const props = defineProps(['userId', 'type', 'title']);
const addressExists = ref(false);
const isEditing = ref(false);

const address = ref({
  userId: props.userId,
  firstName: '',
  lastName: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  country: '',
  adressType: props.type
});

const loadAddress = async () => {
  try {
    const data = await fetchAddressByUserAndType(props.userId, props.type);
    if (data) {
      address.value = data;
      addressExists.value = true;
    }
  } catch (e) {
    addressExists.value = false;
  }
};

const handleSave = async () => {
  const result = await saveAddress(address.value);
  address.value = result;
  addressExists.value = true;
  isEditing.value = false;
};

onMounted(loadAddress);
</script>