import { defineStore } from 'pinia'
import * as api from '@/services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    totalSum: 0,
    currentUserId: null
  }),
  actions: {
    setUserId(id) {
      this.currentUserId = id
    },

    async loadCart() {
      if (this.currentUserId) {
        try {
          const data = await api.fetchCartByUserId(this.currentUserId)
          this.items = data.items || []
          this.totalSum = data.totalSum || 0
        } catch (error) {
          console.error("Fehler beim Laden (API):", error)
        }
      } else {
        const data = localStorage.getItem('cart')
        if (data) {
          this.items = JSON.parse(data)
          this.totalSum = this.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
        } else {
          this.items = []
          this.totalSum = 0
        }
      }
    },

    async addItem(cartItem) {
      if (this.currentUserId) {
        try {
          await api.addToCart(this.currentUserId, cartItem.productId, cartItem.variantId, cartItem.quantity)
          await this.loadCart() 
        } catch (error) {
          console.error("API Error:", error)
        }
      } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingIndex = cart.findIndex(item => item.variantId === cartItem.variantId)
        if (existingIndex > -1) {
          cart[existingIndex].quantity += cartItem.quantity
        } else {
          cart.push(cartItem)
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        await this.loadCart()
      }
    },

    async removeItem(variantId) {
      if (this.currentUserId) {
        try {
          // KORREKTUR: API-Call aktiviert und Name angepasst
          await api.deleteCartItem(this.currentUserId, variantId)
          await this.loadCart() 
        } catch (error) {
          console.error("Fehler beim Löschen (API):", error)
        }
      } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const updatedCart = cart.filter(item => item.variantId !== variantId)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        await this.loadCart()
      }
    },

    async updateQuantity(variantId, newQuantity) {
      if (this.currentUserId) {
        try {
          const qty = Number(newQuantity)
          await api.updateCartItemQuantity(this.currentUserId, variantId, qty)
          await this.loadCart()
        } catch (error) {
          console.error("Fehler beim Aktualisieren der Menge:", error)
        }
      } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const item = cart.find(i => i.variantId === variantId)
        if (item) {
          item.quantity = Number(newQuantity)
          localStorage.setItem('cart', JSON.stringify(cart))
          await this.loadCart()
        }
      }
    },

    async clearCart() {
      if (this.currentUserId) {
        try {
          await api.clearCart(this.currentUserId)
          await this.loadCart()
        } catch (error) {
          console.error("Fehler beim Leeren des Warenkorbs:", error)
        }
      } else {
        localStorage.removeItem('cart')
        await this.loadCart()
      }
    }
  }

})