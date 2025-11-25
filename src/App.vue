<script setup>
</script>

<template>
  <div class="page">
    <header class="header">
        <button class="menu-toggle" id="menu-toggle" aria-label="Menü öffnen" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>

        <div class="left-group">
            <div class="logo">
                <img src="/img/hauptlogo_Header.png" alt="LetItFlow Logo">
            </div>

            <nav class="nav" id="nav">
                <a href="#">Produkte</a>
            </nav>
        </div>

        <div class="icons">
            <span>DE</span>
            <img src="/img/benutzerIcon_Desktop.png" alt="Benutzer">
            <img src="/img/warenkorb_icon.png" alt="Warenkorb">
        </div>
    </header>

    <section class="hero">
        <img src="/img/produktuebersicht.png" alt="Produkte Hero Bild" />
    </section>

    <section class="intro">
        <p>
            Produkte, die wirklich zu Dir passen – <strong>ehrlich</strong>, <strong>alltagstauglich</strong> und
            <strong>einfach gut</strong>. Ohne Schnickschnack, dafür mit ganz viel <strong>Sinn für Dich.</strong>
        </p>
        <button class="button">Erfahre mehr über uns hier</button>
    </section>

    <section class="products">
        <h2>Welche Produkte kennst du bereits?</h2>
        <div class="product-grid">
            <div class="card">
                <img src="/img/menstruationsscheiben_und_tassen.png" alt="Menstruationstasse">
                <h3>Menstruationsscheiben und Tassen</h3>
                <button class="button">jetzt entdecken</button>
            </div>
            <div class="card">
                <img src="/img/menstruationsschwaemme_und_SoftTampons.png" alt="Menstruationsschwämme">
                <h3>Menstruationsschwämme und Soft-Tampons</h3>
                <button class="button">jetzt entdecken</button>
            </div>
            <div class="card">
                <img src="/img/periodenunterwaesche.png" alt="Periodenunterwäsche">
                <h3>Periodenunterwäsche</h3>
                <button class="button">jetzt entdecken</button>
            </div>
            <div class="card">
                <img src="/img/tampon.png" alt="Bio- Tampons">
                <h3>Bio- Tampons</h3>
                <button class="button">jetzt entdecken</button>
            </div>
            <div class="card">
                <img src="/img/binde.png" alt="Bio- Binden">
                <h3>Bio- Binden</h3>
                <button class="button">jetzt entdecken</button>
            </div>
            <div class="card">
                <img src="/img/waermehelfer.png" alt="Wärmehelfer">
                <h3>Wärmehelfer</h3>
                <button class="button">jetzt entdecken</button>
            </div>
        </div>
    </section>

    <footer class="site-footer">
        <div class="footer-inner">
            <div class="footer-top">
                <div class="footer-logo">
                    <img src="/img/hauptlogo_Footer.png" alt="LetItFlow Logo" height="30">
                </div>
                <div class="footer-col">
                    <h4>HILFETHEMEN</h4>
                    <ul>
                        <li><a href="#">Alle Hilfethemen</a></li>
                        <li><a href="#">Bezahlarten</a></li>
                        <li><a href="#">Versandinformationen</a></li>
                        <li><a href="#">Bestellung retournieren</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>RECHTLICHES</h4>
                    <ul>
                        <li><a href="#">Datenschutz</a></li>
                        <li><a href="#">Cookie-Richtlinie</a></li>
                        <li><a href="#">Widerrufsrecht</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>ÜBER UNS</h4>
                    <ul>
                        <li><a href="#">Unsere Geschichte</a></li>
                        <li><a href="#">Kontakt</a></li>
                        <li><a href="#">Impressum</a></li>
                        <li><a href="#">AGB</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 LetItFlow</p>
                <p>Ehrlich. Alltagstauglich. Einfach gut.</p>
            </div>
        </div>
    </footer>
  </div>
</template>

<style scoped>
/* Hier kannst du Vue-spezifische Zusatz-Styles schreiben.
   Deine bestehenden Styles kommen global aus header_style.css, body_style.css, footer_style.css. */
</style>
