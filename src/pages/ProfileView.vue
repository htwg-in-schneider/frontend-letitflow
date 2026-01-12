<template>
  <div class="profile-container max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Profil</h1>

    <div v-if="loading" class="text-gray-600">Lade Profil...</div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Fehler beim Laden des Profils: {{ error }}
    </div>

    <div v-else class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
          Vorname
        </label>
        <input
          v-model="profile.firstName"
          id="firstName"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
          Nachname
        </label>
        <input
          v-model="profile.lastName"
          id="lastName"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          v-model="profile.email"
          id="email"
          type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Rolle
        </label>
        <input
          :value="profile.role"
          readonly
          type="text"
          class="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight cursor-not-allowed"
        >
      </div>

      <div class="flex items-center justify-between">
        <button
          @click="saveProfile"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="saving"
        >
          {{ saving ? 'Speichert...' : 'Speichern' }}
        </button>
        <span v-if="successMessage" class="text-green-500 text-sm ml-4">
          {{ successMessage }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '@/api/authFetch.js';

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
