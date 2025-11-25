<script setup>
</script>

<template>
  <header class="header">
    <button
      class="menu-toggle"
      id="menu-toggle"
      aria-label="Menü öffnen"
      aria-expanded="false"
    >
      <span></span><span></span><span></span>
    </button>

    <div class="left-group">
      <div class="logo">
        <img src="/img/hauptlogo_Header.png" alt="LetItFlow Logo" />
      </div>

      <nav class="nav" id="nav">
        <a href="#">Produkte</a>
      </nav>
    </div>

    <div class="icons">
      <span>DE</span>
      <img src="/img/benutzerIcon_Desktop.png" alt="Benutzer" />
      <img src="/img/warenkorb_icon.png" alt="Warenkorb" />
    </div>
  </header>
</template>

<style scoped>
/* Wenn nötig, header-spezifische Vue-Styles.
   Das meiste Styling kommt aus deiner header_style.css */
</style>
