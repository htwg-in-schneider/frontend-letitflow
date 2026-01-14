<template>
  <div
    class="border border-dashed border-[#f0c9b8] bg-white rounded-md shadow-sm flex flex-col overflow-hidden self-start"
  >
    <div class="p-4 pb-0">
      <ImagePickerCard
        v-model="newProduct.imageUrl"
        alt="Neues Produkt Bild"
        :confirmRemove="false"
      />
    </div>

    <div class="p-4 flex flex-col gap-3">
      <AdminProductFields v-model="newProduct" :autoOpenIfHasInfo="false" />

      <AdminAddVariant v-model="variantsToCreate" :error="createError" />

      <button
        type="button"
        class="rounded-full px-4 py-2 text-xs font-medium text-white bg-[#e09a82] disabled:opacity-60"
        :disabled="creating || !newProduct.title"
        @click="handleCreateProduct"
      >
        {{ creating ? 'Speichere…' : 'Produkt + Varianten speichern' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ImagePickerCard from '@/components/ImagePickerCard.vue'
import AdminAddVariant from '@/components/AdminAddVariant.vue'
import AdminProductFields from '@/components/AdminProductFields.vue'

import { createProduct, createVariant } from '@/services/api'

const props = defineProps({
  categoryId: { type: Number, required: true }
})

const emit = defineEmits(['created'])

const creating = ref(false)
const createError = ref(null)

const newProduct = ref({
  title: '',
  description: '',
  imageUrl: '',
  infotext1: '',
  infotext2: '',
  infotext3: ''
})

const variantsToCreate = ref([{ size: '', color: '', stock: 0, price: 0 }])

function validateCreate() {
  if (!newProduct.value.title) return 'Titel darf nicht leer sein.'
  if (!variantsToCreate.value.length) return 'Mindestens eine Variante ist erforderlich.'

  for (let i = 0; i < variantsToCreate.value.length; i++) {
    const v = variantsToCreate.value[i]
    const stockOk = typeof v.stock === 'number' && v.stock >= 0
    const priceOk = typeof v.price === 'number' && v.price >= 0
    if (!stockOk) return `Variante ${i + 1}: Bitte einen gültigen Bestand (>= 0) angeben.`
    if (!priceOk) return `Variante ${i + 1}: Bitte einen gültigen Preis (>= 0) angeben.`
  }

  return null
}

function resetCreateForm() {
  newProduct.value = {
    title: '',
    description: '',
    imageUrl: '',
    infotext1: '',
    infotext2: '',
    infotext3: ''
  }
  variantsToCreate.value = [{ size: '', color: '', stock: 0, price: 0 }]
  createError.value = null
}

async function handleCreateProduct() {
  createError.value = validateCreate()
  if (createError.value) return

  creating.value = true
  try {
    const created = await createProduct({
      ...newProduct.value,
      categoryId: props.categoryId
    })

    const productId = created?.id ?? created

    await Promise.all(
      variantsToCreate.value.map((v) =>
        createVariant(productId, {
          ...v,
          available: Number(v.stock) > 0
        })
      )
    )

    resetCreateForm()
    emit('created') 
  } catch (e) {
    console.error(e)
    createError.value = 'Fehler beim Erstellen des Produkts oder der Varianten.'
  } finally {
    creating.value = false
  }
}
</script>
