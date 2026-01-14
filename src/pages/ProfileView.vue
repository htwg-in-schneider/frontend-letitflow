<template>
  <div class="min-h-screen bg-[#fff7f3] pt-12 px-4 pb-20">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-12 text-gray-800">
        Profil verwalten
      </h1>

      <div v-if="loading" class="text-center text-gray-600">Lade Profil...</div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Fehler beim Laden des Profils: {{ error }}
      </div>

      <div v-else class="bg-white p-8 rounded-3xl shadow-sm border border-[#e7b2a5]/30">
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-xl font-bold mb-6 text-gray-900 border-b border-[#fff7f3] pb-2">Deine Daten</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
                  Vorname
                </label>
                <input
                    v-model="profile.firstName"
                    id="firstName"
                    type="text"
                    class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#e09a82]"
                >
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
                  Nachname
                </label>
                <input
                    v-model="profile.lastName"
                    id="lastName"
                    type="text"
                    class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#e09a82]"
                >
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                  Email
                </label>
                <input
                    v-model="profile.email"
                    id="email"
                    type="email"
                    readonly
                    class="bg-gray-100 shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight cursor-not-allowed"
                >
              </div>
            </div>

            <div class="flex items-center justify-start gap-4 mt-8 pt-6 border-t border-[#fff7f3]">
              <button
                  @click="saveProfile"
                  class="bg-[#e09a82] hover:bg-[#d58d7d] text-white font-bold py-2 px-6 rounded-full focus:outline-none transition-all"
                  :disabled="saving"
              >
                {{ saving ? 'Speichert...' : 'Speichern' }}
              </button>
              <span v-if="successMessage" class="text-green-600 text-sm font-medium">
                {{ successMessage }}
              </span>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h2 class="text-xl font-bold mb-4 text-gray-900 border-b border-[#fff7f3] pb-2">Lieferadresse</h2>
              <AddressCard
                  type="SHIPPING"
                  :readonly="false"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold mb-4 text-gray-900 border-b border-[#fff7f3] pb-2">Rechnungsadresse</h2>
              <AddressCard
                  type="BILLING"
                  :readonly="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {authFetch} from '@/api/authFetch.js';
import AddressCard from '@/components/AddressCard.vue';

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
});

const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const successMessage = ref('');

async function loadProfile() {
  loading.value = true;
  error.value = null;
  try {
    const data = await authFetch('/api/users/me');
    profile.value = data;
  } catch (err) {
    console.error('Error loading profile:', err);
    error.value = err.message || 'Ein unbekannter Fehler ist aufgetreten.';
  } finally {
    loading.value = false;
  }
}

async function saveProfile() {
  saving.value = true;
  successMessage.value = '';
  error.value = null;

  const payload = {
    firstName: profile.value.firstName,
    lastName: profile.value.lastName,
    email: profile.value.email
  };

  try {
    await authFetch('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    successMessage.value = 'Profil erfolgreich gespeichert!';
  } catch (err) {
    console.error('Error saving profile:', err);
    error.value = 'Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>
