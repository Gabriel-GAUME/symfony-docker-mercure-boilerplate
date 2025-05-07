import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import store from './store'; // Import du store
import Chat from './components/ChatBox.vue';
import Conversations from './views/Conversations.vue';

// Définir les routes
const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: { requiresGuest: true }, // Accessible uniquement si non connecté
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { requiresGuest: true }, // Accessible uniquement si non connecté
    },
    { 
        path: '/chat/:id', 
        component: Chat,
        meta: { requiresAuth: true },
    },
    { 
        path: '/conversations', 
        component: Conversations,
        meta: { requiresAuth: true },
    },
];

// Créer le router
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Gérer l'authentification avant chaque navigation
router.beforeEach(async (to, from, next) => {
    console.log("couou")
    console.log(store.getters['user/isAuthenticated'])
    console.log(localStorage.getItem('access_token'))
    // Charger l'utilisateur si ce n'est pas encore fait
    if (!store.getters['user/isAuthenticated'] && localStorage.getItem('access_token')) {
        console.log("1")
        try {
            await store.dispatch('user/loadUser'); // Charge l'utilisateur si le token est valide
        } catch (error) {
            console.error('Erreur lors du chargement de l\'utilisateur :', error);
            store.dispatch('user/logout');
        }
    }

    console.log(to.meta)
    console.log(store.getters['user/isAuthenticated'])
    // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
    if (to.meta.requiresAuth && !store.getters['user/isAuthenticated']) {
        console.log("2")
        return next({ name: 'login' });
    }

    // Si la route est réservée aux invités et que l'utilisateur est connecté
    if (to.meta.requiresGuest && store.getters['user/isAuthenticated']) {
        console.log("3")
        return next({ name: 'home' });
    }

    next();
});

export default router;
