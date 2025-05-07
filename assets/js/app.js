import { createApp } from 'vue';
import App from './views/App.vue';

import router from './router';
import store from './store';

// Création de l'application Vue
const app = createApp({});

app.use(router);
app.use(store);  

// Enregistrer le composant globalement
app.component('App', App);

// Monter l'applicatio
app.mount('#app');