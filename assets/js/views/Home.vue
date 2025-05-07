<template>
  <div class="home-container">
    <!-- Menu -->

    <!-- Contenu principal -->
    <main class="content">
      <h2>Bienvenue sur notre site !</h2>
      <p>Voici les dernières annonces disponibles :</p>

      <button class="add-btn" @click="showModal = true">➕ Ajouter une annonce</button>

      <!-- Liste d’annonces -->
      <section class="annonce-list">
        <div v-for="advertissement in advertissements" :key="advertissement.id" class="annonce-card">
          <h3>{{ advertissement.title }}</h3>
          <p>{{ advertissement.description }}</p>
          <button v-if="advertissement.creator.id != user.id" class="annonce-btn"
            @click="openChat(advertissement.creator)">Discuter</button>
        </div>
      </section>
    </main>

    <!-- Modal d'ajout -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h3>Ajouter une nouvelle annonce</h3>
        <form @submit.prevent="addAdvertissement">
          <input v-model="nouvelleAnnonce.title" type="text" placeholder="Titre" required />
          <textarea v-model="nouvelleAnnonce.description" placeholder="Contenu" required></textarea>
          <div class="modal-actions">
            <button type="submit">Ajouter</button>
            <button type="button" class="cancel-btn" @click="showModal = false">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HomePage',
  data() {
    return {
      showModal: false,
      nouvelleAnnonce: {
        title: '',
        description: '',
      },
      annonces: []
    };
  },
  async created() {
    await this.getAll;
    console.log(this.user)
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push('/login');
    },
    async addAdvertissement() {
      await this.$store.dispatch('advertissement/create', this.nouvelleAnnonce);
      this.nouvelleAnnonce.title = '';
      this.nouvelleAnnonce.description = '';
      this.showModal = false;
    },
    openChat(user) {
      this.$router.push(`/chat/${user.id}`);
    },
  },
  computed: {
    ...mapActions('advertissement', ['getAll']),
    ...mapGetters('user', ['user', 'users']),
    ...mapGetters('advertissement', ['advertissements']),
  },
};
</script>

<style scoped>
.home-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Navbar */
.navbar {
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

/* Contenu principal */
.content {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
}

.add-btn {
  margin-bottom: 30px;
  padding: 10px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background-color: #27ae60;
}

.annonce-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.annonce-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  text-align: left;
}

.annonce-card:hover {
  transform: translateY(-4px);
}

.annonce-card h3 {
  margin-top: 0;
  color: #333;
}

.annonce-btn {
  margin-top: 10px;
  padding: 10px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.annonce-btn:hover {
  background-color: #357abd;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.modal input,
.modal textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.modal textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background-color: #2ecc71;
  color: white;
}

.cancel-btn {
  background-color: #bdc3c7;
  color: white;
}
</style>