import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)


export const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
       
        redirect_uri: window.location.origin + import.meta.env.BASE_URL,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    }
})

app.use(auth0)

app.mount('#app')
