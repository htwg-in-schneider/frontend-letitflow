<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-12">
    <section class="mx-auto max-w-3xl bg-white rounded-xl border border-neutral-200 p-8">

      <!-- Headline -->
      <h1 class="text-4xl md:text-5xl tracking-widest uppercase mb-4">
        Hast du noch Fragen?
      </h1>

      <p class="text-neutral-600 max-w-2xl mb-10 leading-relaxed">
        Dann fülle einfach das folgende Kontaktformular aus – unser
        Customer Team hilft dir gerne weiter.
      </p>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submit">

        <div>
          <label class="block text-sm mb-2">Vorname</label>
          <input
              v-model="form.firstName"
              type="text"
              required
              placeholder="Vorname eingeben ..."
              class="w-full rounded-lg border px-4 py-3 focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label class="block text-sm mb-2">Nachname</label>
          <input
              v-model="form.lastName"
              type="text"
              placeholder="Nachname eingeben ..."
              class="w-full rounded-lg border px-4 py-3 focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label class="block text-sm mb-2">Deine E-Mail*</label>
          <input
              v-model="form.email"
              type="email"
              required
              placeholder="E-Mail Adresse"
              class="w-full rounded-lg border px-4 py-3 focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label class="block text-sm mb-2">Deine Nachricht *</label>
          <textarea
              v-model="form.message"
              rows="5"
              required
              placeholder="Kommentar eingeben ..."
              class="w-full rounded-lg border px-4 py-3 resize-none focus:outline-none focus:border-neutral-400"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button
              type="submit"
              class="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition"
          >
            Nachricht senden
          </button>

          <span v-if="success" class="text-sm text-neutral-600">
            Danke! Nachricht wurde gesendet.
          </span>
        </div>

      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";

const success = ref(false);

const form = reactive({
  firstName: "",
  lastName: "",
  topic: "Retoure",
  email: "",
  message: "",
});

function submit() {
  // TODO: später an Backend senden
  console.log(form);

  success.value = true;

  form.firstName = "";
  form.lastName = "";
  form.topic = "Retoure";
  form.email = "";
  form.message = "";


  setTimeout(() => (success.value = false), 3000);
}
</script>
