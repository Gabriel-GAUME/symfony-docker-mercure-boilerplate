<template>
    <v-app>

        <!-- Sizes your content based upon application components -->
        <v-main>
            <v-container>
                <header class="navbar">
                    <h1 class="logo">MonSite</h1>
                    <nav class="menu">
                        <router-link to="/" class="menu-item">Accueil</router-link>
                        <router-link to="/conversations" class="menu-item">Conversation</router-link>
                        <router-link to="/register" class="menu-item">Inscription</router-link>
                        <button class="logout-btn" @click="logout">Se déconnecter</button>
                    </nav>
                </header>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "layout",
    components: {

    },
    data() {
        return {
        }
    },
    async created() {
    },
    async mounted() {
        await this.loadUser;

    },
    computed: {
        ...mapActions('user', ['loadUser']),
    },
    watch: {
    },

    methods: {
        async logout(){
            const response = await this.$store.dispatch("user/logout");

            if(response){
                window.location.href = '/login';
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.navbar {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #4a90e2;
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-item {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.menu-item:hover {
  opacity: 0.8;
}

.logout-btn {
  padding: 8px 14px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>