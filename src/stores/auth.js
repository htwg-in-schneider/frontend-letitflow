import { defineStore } from 'pinia'
import { fetchCurrentUser } from '@/services/api'

const ADMIN_MARKERS = ['ROLE_ADMIN', 'admin', 'ADMIN']

function normalizeRoles(raw) {
	if (!raw) return []
	if (Array.isArray(raw)) {
		return raw
			.map((r) => {
				if (typeof r === 'string') return r
				if (r?.authority) return r.authority
				if (r?.role) return r.role
				if (r?.name) return r.name
				return null
			})
			.filter(Boolean)
	}
	if (typeof raw === 'string') {
		return raw.split(',').map((s) => s.trim()).filter(Boolean)
	}
	if (typeof raw === 'object') {
		const nested = raw.roles || raw.permissions || raw.authorities || raw.role || raw.authority
		return normalizeRoles(nested)
	}
	return []
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		auth0User: null,
		profile: null,
		roles: [],
		loading: false,
		error: null,
	}),
	getters: {
		isAuthenticated: (state) => !!state.auth0User,
		isAdmin: (state) => Array.isArray(state.roles) && state.roles.some(r => ADMIN_MARKERS.includes(r)),
		oauthId: (state) => state.auth0User?.sub || null,
	},
	actions: {
		setAuth0User(user) {
			this.auth0User = user || null
		},
		async loadProfile() {
			if (!this.auth0User) {
				this.profile = null
				this.roles = []
				return
			}
			this.loading = true
			this.error = null
			try {
				const me = await fetchCurrentUser()
				this.profile = me
				// Backend liefert 'role' (singular) als Enum oder String: z.B. ROLE_ADMIN, ROLE_USER
				const roleValue = me?.role
				const rolesArray = roleValue ? [String(roleValue)] : []
				this.roles = rolesArray
				console.debug('authStore.loadProfile', { role: roleValue, roles: this.roles, profile: me })
			} catch (err) {
				console.warn('authStore.loadProfile failed', err)
				this.error = err
				this.profile = null
				this.roles = []
			} finally {
				this.loading = false
			}
		},
		logoutCleanup() {
			this.auth0User = null
			this.profile = null
			this.roles = []
			this.error = null
		}
	}
})
