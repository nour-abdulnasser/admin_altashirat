// Libraries
import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Router
import router from '@/router/index';

// Stores that need initialization
import { useAuthStore } from './stores/auth.js';

// Plugins
import i18n from '@/plugins/i18n/index';
import veevalidate from '@/plugins/veevalidate/index';
import vuetify from '@/plugins/vuetify/index';

// App
import app from '@/shared/index.js';
import "@/assets/scss/main.scss";

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(veevalidate)
app.use(vuetify)

// Initialize auth state before mounting the app
const authStore = useAuthStore();
authStore.initAuth().then(() => {
  // Mount the app once the auth is initialized
  app.mount('#app');
});
