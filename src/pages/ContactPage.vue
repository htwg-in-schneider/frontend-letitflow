<template>
  <main class="min-h-screen bg-[#fff7f3] px-4 py-12">
    <section class="mx-auto max-w-3xl bg-white rounded-2xl border border-orange-100 p-8 shadow-sm">

      <!-- Headline -->
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#e09a82]">
        Hast du noch Fragen?
      </h1>

      <p class="text-neutral-600 max-w-2xl mb-10 leading-relaxed text-lg">
        Dann fülle einfach das folgende Kontaktformular aus – unser
        Customer Team hilft dir gerne weiter.
      </p>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="submit">

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700">Vorname</label>
          <input
              v-model="form.firstName"
              type="text"
              required
              placeholder="Vorname eingeben ..."
              class="w-full rounded-xl border border-orange-100 px-4 py-3 focus:outline-none focus:border-orange-300 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700">Nachname</label>
          <input
              v-model="form.lastName"
              type="text"
              placeholder="Nachname eingeben ..."
              class="w-full rounded-xl border border-orange-100 px-4 py-3 focus:outline-none focus:border-orange-300 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700">Deine E-Mail*</label>
          <input
              v-model="form.email"
              type="email"
              required
              placeholder="E-Mail Adresse"
              class="w-full rounded-xl border border-orange-100 px-4 py-3 focus:outline-none focus:border-orange-300 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-neutral-700">Deine Nachricht *</label>
          <textarea
              v-model="form.message"
              rows="5"
              required
              placeholder="Kommentar eingeben ..."
              class="w-full rounded-xl border border-orange-100 px-4 py-3 resize-none focus:outline-none focus:border-orange-300 transition"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button
              type="submit"
              class="bg-[#e09a82] text-white px-8 py-3 rounded-full hover:bg-[#d48366] transition font-semibold"
          >
            Nachricht senden
          </button>

          <span v-if="success" class="text-sm text-neutral-600 font-medium">
            Dein E-Mail-Programm wurde geöffnet.
          </span>
        </div>

        <p class="text-xs text-neutral-500">
          Beim Absenden öffnet sich dein E-Mail-Programm mit vorausgefüllter Nachricht.
        </p>

      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const success = ref(false);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  message: "",
});

function submit() {
  const to = "kontakt@letitflow.de"; // ⬅️ anpassen
  const subject = encodeURIComponent("Kontaktanfrage über die Website");

  const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\n` +
      `E-Mail: ${form.email}\n\n` +
      `Nachricht:\n${form.message}`
  );

  const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;

  window.location.href = mailtoLink;

  success.value = true;

  form.firstName = "";
  form.lastName = "";
  form.email = "";
  form.message = "";

  setTimeout(() => (success.value = false), 3000);
}
</script>
