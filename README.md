# LetItFlow
Frontend for a period products webshop.

## 🧱 Tech-Stack
- Vue 3 
- Vite (Development & Build Tool)
- Tailwind CSS
- Vue Router

---

## 🚀 Features

### 🔍 Search & Filter
The application provides:
- Filtering by:
    - Category
    - Color (from product variants)
    - Size (from product variants)
    - Price ranges (unter 10 €, 10–20 €, 20–30 €, über 30 €)

### 🛍 Product Overview
- Dynamic loading of products from the backend
- Product cards display:
    - Title
    - Image
    - Available colors & sizes
    - Price
    - Availability information

### 🗂 Category Overview
- Categories are loaded dynamically from the backend
- Clicking a category shows products filtered by the category slug

### 🔗 Backend Integration
- All product, category and variant data is retrieved via REST API
- Centralized API service handles requests

---

## 📦 Installation

### Install dependencies
```bash
npm install

### 🚀 *Run the application in development mode*

npm run dev



