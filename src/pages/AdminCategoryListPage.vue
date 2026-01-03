<template>
  <section class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Kategorien (Admin)</h1>

   
    <div v-if="loading">Lade Kategorien...</div>
    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>

  
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
      <div
        class="border border-dashed border-[#f0c9b8] bg-white flex flex-col rounded-md overflow-hidden shadow-sm"
      >
        
        <label class="w-full cursor-pointer block">
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImageSelected"
          />
          <div class="w-full aspect-[4/3] flex items-center justify-center bg-gray-50">
            <img
              v-if="newCategory.imageUrl"
              :src="newCategory.imageUrl"
              alt="Neue Kategorie Bild"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="text-xs text-gray-500 text-center px-4"
            >
              Klicke hier, um ein Bild<br />
              von deinem Gerät auszuwählen
            </div>
          </div>
        </label>

        <div class="flex-1 flex flex-col justify-between px-4 py-4 gap-3">
          
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Kategoriename
            </label>
            <input
              v-model="newCategory.name"
              placeholder="z. B. Bio-Tampons"
              class="w-full border rounded px-2 py-1 text-base font-semibold"
            />
          </div>

          
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Slug (automatisch)
            </label>
            <div
              class="w-full border rounded px-2 py-1 bg-gray-100 text-xs font-mono text-gray-600"
            >
              {{ slugify(newCategory.name) || 'wird aus dem Namen erzeugt' }}
            </div>
          </div>

          
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">
              Beschreibung (optional)
            </label>
            <textarea
              v-model="newCategory.description"
              rows="2"
              class="w-full border rounded px-2 py-1 text-sm"
              placeholder="Kurze Beschreibung der Kategorie"
            />
          </div>

          <button
            class="mt-2 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!newCategory.name"
            @click="handleCreate"
          >
            Kategorie speichern
          </button>
        </div>
      </div>

    
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="border border-[#f0c9b8] bg-white flex flex-col rounded-md overflow-hidden shadow-sm"
      >
        <img
          :src="cat.imageUrl || 'https://via.placeholder.com/400x300?text=Kategorie'"
          :alt="cat.name"
          class="w-full object-cover aspect-[4/3]"
        />

        <div class="flex-1 flex flex-col justify-between px-4 py-4">
          <div>
            <h3 class="font-semibold text-lg leading-snug mb-1">
              {{ cat.name }}
            </h3>
            <p class="text-xs text-gray-500 mb-3">
              Slug: <span class="font-mono">{{ cat.slug }}</span>
            </p>
          </div>

          <div class="mt-4 flex justify-between gap-2">
           
            <router-link
              :to="{ name: 'AdminCategoryDetail', params: { id: cat.id } }"
              class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-[#e09a82]"
            >
              Bearbeiten
            </router-link>

           
            <button
              class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium text-white bg-red-500"
              @click="handleDelete(cat.id)"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>

      
      <div
        v-if="categories.length === 0"
        class="col-span-full text-center text-gray-500 text-sm"
      >
        Noch keine Kategorien vorhanden.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  uploadImage
} from '@/services/api'

const categories = ref([])
const newCategory = ref({
  name: '',
  description: '',
  imageUrl: '' 
})
const loading = ref(false)
const error = ref(null)


function slugify(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^a-z0-9\-]/g, '') 
}

async function loadCategories() {
  loading.value = true
  error.value = null
  try {
    categories.value = await fetchCategories()
  } catch (e) {
    error.value = 'Kategorien konnten nicht geladen werden.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  const payload = {
    name: newCategory.value.name,
    slug: slugify(newCategory.value.name),
    description: newCategory.value.description || '',
    imageUrl: newCategory.value.imageUrl || ''
  }

  if (!payload.name) {
    alert('Name darf nicht leer sein')
    return
  }

  try {
    await createCategory(payload)
    
    newCategory.value = { name: '', description: '', imageUrl: '' }
    await loadCategories()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Erstellen der Kategorie (Slug evtl. schon vergeben?)')
  }
}

async function handleDelete(id) {
  if (!confirm('Kategorie wirklich löschen?')) return
  try {
    await deleteCategory(id)
    await loadCategories()
  } catch (e) {
    console.error(e)
    alert('Fehler beim Löschen der Kategorie')
  }
}


function onImageSelected(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
   
    newCategory.value.imageUrl = reader.result
  }
  reader.readAsDataURL(file)
}

onMounted(() => {
  loadCategories()
})
</script>
