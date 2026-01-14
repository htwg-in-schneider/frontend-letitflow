<template>
  <div class="bg-white border border-orange-100 p-8 rounded-2xl shadow-sm space-y-6">
    <h3 class="text-xl font-bold text-gray-800 border-b border-orange-50 pb-4">{{ title }}</h3>

    <div v-if="addressExists && !isEditing" class="space-y-2 text-gray-600">
      <p class="font-semibold text-gray-900 text-lg">{{ address.firstName }} {{ address.lastName }}</p>
      <p>{{ address.street }} {{ address.housenumber }}</p>
      <p>{{ address.postalCode }} {{ address.city }}</p>
      <p>{{ address.country }}</p>

      <button v-if="!props.readonly" @click="isEditing = true"
              class="mt-4 text-[#e09a82] hover:text-[#d48366] text-sm font-semibold transition underline decoration-dotted">
        Adresse bearbeiten
      </button>
    </div>

    <form v-else-if="!props.readonly" @submit.prevent="handleSave" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 mb-1 ml-1">Vorname</label>
          <input v-model="address.firstName" placeholder="Vorname"
                 class="border border-orange-100 bg-[#fffcf9] p-3 rounded-xl w-full focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
        </div>
        <div class="flex flex-col">
          <label class="text-xs font-semibold text-gray-500 mb-1 ml-1">Nachname</label>
          <input v-model="address.lastName" placeholder="Nachname"
                 class="border border-orange-100 bg-[#fffcf9] p-3 rounded-xl w-full focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-500 mb-1 ml-1">Straße & Hausnummer</label>
        <div class="flex gap-2">
          <input v-model="address.street" placeholder="Straße"
                 class="flex-[2] border border-orange-100 bg-[#fffcf9] p-3 rounded-xl focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
          <input v-model="address.housenumber" placeholder="Nr."
                 class="w-20 border border-orange-100 bg-[#fffcf9] p-3 rounded-xl focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col col-span-1">
          <label class="text-xs font-semibold text-gray-500 mb-1 ml-1">PLZ</label>
          <input v-model="address.postalCode" placeholder="PLZ"
                 class="border border-orange-100 bg-[#fffcf9] p-3 rounded-xl w-full focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
        </div>
        <div class="flex flex-col col-span-2">
          <label class="text-xs font-semibold text-gray-500 mb-1 ml-1">Stadt</label>
          <input v-model="address.city" placeholder="Stadt"
                 class="border border-orange-100 bg-[#fffcf9] p-3 rounded-xl w-full focus:ring-2 focus:ring-[#e09a82] outline-none transition"
                 required>
        </div>
      </div>

      <button type="submit"
              class="w-full bg-[#e09a82] text-white py-4 rounded-xl font-bold hover:bg-[#d48366] transition-all transform hover:scale-[1.01] shadow-md mt-4">
        Speichern
      </button>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {fetchAddressByUserAndType, saveAddress} from '@/services/api.js';
import {useToast} from '@/composables/useToast';

const props = defineProps(['title', 'userId', 'type', 'readonly']);
const emit = defineEmits(['loaded']);
const {error} = useToast();
const addressExists = ref(false);
const isEditing = ref(false);

const address = ref({
  userId: props.userId,
  firstName: '',
  lastName: '',
  street: '',
  housenumber: '',
  postalCode: '',
  city: '',
  country: '',
  adressType: props.type // Wird automatisch SHIPPING oder BILLING
});

const loadAddress = async () => {
  try {
    const data = await fetchAddressByUserAndType(props.type);
    if (data) {
      address.value = data;
      addressExists.value = true;
      emit('loaded', {type: props.type, addressId: data.id});
    } else {
      addressExists.value = false;
    }
  } catch (e) {
    console.error('Fehler beim Laden der Adresse:', e);
    addressExists.value = false;
    address.value.userId = props.userId;
    address.value.adressType = props.type;
  }
};

onMounted(() => {
  loadAddress();
});

watch(() => props.userId, () => {
  loadAddress();
});

const handleSave = async () => {
  try {
    address.value.userId = props.userId;
    address.value.adressType = props.type;

    console.log('Sending address to backend:', JSON.stringify(address.value, null, 2));

    const saved = await saveAddress(address.value);
    address.value = saved;
    addressExists.value = true;
    isEditing.value = false;

    emit('loaded', {type: props.type, addressId: saved.id});
  } catch (e) {
    console.error('Fehler beim Speichern:', e);
    error('Fehler beim Speichern');
  }
};
</script>