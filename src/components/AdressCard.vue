<template>
  <div class="max-w-md p-6 bg-[#FFFBF5] rounded-lg shadow-sm mb-6 font-sans">
    <h2 class="text-xl font-bold mb-4">
      {{ type === 'SHIPPING' ? 'Deine Lieferadresse' : 'Deine Rechnungsadresse' }}
    </h2>

    <div v-if="addressExists && !isEditing" class="space-y-1 text-lg">
      <p><span class="font-medium">Nachname:</span> {{ address.lastName }}</p>
      <p><span class="font-medium">Vorname:</span> {{ address.firstName }}</p>
      <div class="pt-2">
        <p class="font-medium">Adresse:</p>
        <p>{{ address.street }}</p>
        <p>{{ address.postalCode }} {{ address.city }}</p>
      </div>
      <button @click="isEditing = true" class="w-full mt-4 bg-[#E3907E] text-white py-3 rounded-full shadow-md">
        {{ type === 'SHIPPING' ? 'Lieferadresse ändern' : 'Rechnungsadresse ändern' }}
      </button>
    </div>

    <form v-else @submit.prevent="handleSave" class="space-y-4">
      <input v-model="address.firstName" placeholder="Vorname" class="w-full border-b p-2 bg-transparent" required>
      <input v-model="address.lastName" placeholder="Nachname" class="w-full border-b p-2 bg-transparent" required>
      <input v-model="address.street" placeholder="Straße" class="w-full border-b p-2 bg-transparent" required>
      <div class="flex gap-2">
        <input v-model="address.postalCode" placeholder="PLZ" class="w-1/3 border-b p-2 bg-transparent" required>
        <input v-model="address.city" placeholder="Stadt" class="w-2/3 border-b p-2 bg-transparent" required>
      </div>
      <button type="submit" class="w-full bg-[#E3907E] text-white py-3 rounded-full">
        Speichern
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAddressByUserAndType, saveAddress } from '@/api/api.js';

const props = defineProps(['userId', 'type']);
const addressExists = ref(false);
const isEditing = ref(false);

const address = ref({
  userId: props.userId,
  firstName: '',
  lastName: '',
  street: '',
  postalCode: '',
  city: '',
  adressType: props.type // Wird automatisch SHIPPING oder BILLING
});

onMounted(async () => {
  try {
    const data = await fetchAddressByUserAndType(props.userId, props.type);
    if (data) {
      address.value = data;
      addressExists.value = true;
    }
  } catch (e) {
    addressExists.value = false; // Zeigt Formular an, wenn nichts gefunden wurde
  }
});

const handleSave = async () => {
  try {
    const saved = await saveAddress(address.value);
    address.value = saved;
    addressExists.value = true;
    isEditing.value = false;
  } catch (e) {
    alert("Fehler beim Speichern");
  }
};
</script>