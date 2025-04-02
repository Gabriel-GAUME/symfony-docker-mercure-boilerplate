import { createApp } from 'vue';
import App from './views/App.vue';

// Création de l'application Vue
const app = createApp({});

// Enregistrer le composant globalement
app.component('App', App);

// Monter l'applicatio
app.mount('#app');