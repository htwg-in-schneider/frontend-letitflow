# LetItFlow 🩸

Ein moderner, robuster Frontend-Webshop für Periodenprodukte, entwickelt mit **Vue 3**, **Vite** und **Tailwind CSS**.

---

## 🚀 Überblick

LetItFlow ist ein benutzerfreundlicher Webshop, der darauf ausgelegt ist, den Kauf von Menstruationsprodukten so einfach und angenehm wie möglich zu gestalten.

---

## 🧱 Tech-Stack

- **Framework:** [Vue 3](https://vuejs.org/) 
- **Build-Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Authentifizierung:** [Auth0](https://auth0.com/)

---

## 🛠 Features

### 🛒 Warenkorb & Checkout
- Lokaler Warenkorb für Gäste.
- Synchronisation mit dem Backend für eingeloggte User.

### 📦 Bestellverwaltung
- Übersicht aller getätigten Bestellungen.
- Detaillierte Bestellansicht mit Artikelliste und Preisinformationen.

### 🔍 Suche & Filter
- Dynamische Suche über das gesamte Sortiment.
- Filterung nach Kategorien, Farben, Größen und Preisspannen.

---

## 📂 Projektstruktur

```text
src/
├── api/            # API-Interzeptoren (AuthFetch)
├── components/     # Wiederverwendbare UI-Komponenten
├── composables/    # Shared Logic (Toasts, etc.)
├── pages/          # Seiten-Komponenten (Views)
├── services/       # API-Service-Definitionen
├── stores/         # Pinia Stores (Warenkorb, Auth)
├── utils/          # Hilfsfunktionen (Date, Product-Mapping)
└── assets/         # Statische Ressourcen
```

---

## ⚙️ Installation & Setup

### 1. Repository klonen
```bash
git clone https://github.com/dein-repo/frontend-letitflow.git
cd frontend-letitflow
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 4. Development Server starten
```bash
npm run dev
```

*Dieses Projekt ist ein Studienprojekt an der **HTWG Konstanz**.*



