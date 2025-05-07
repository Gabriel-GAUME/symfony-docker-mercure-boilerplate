<template>
  <div class="register-container">
    <h2>Créer un compte</h2>
    <form @submit.prevent="submitForm" class="register-form">
      <label for="name">Nom</label>
      <input v-model="user.name" type="text" id="name" placeholder="Jean Dupont" required />

      <label for="email">Email</label>
      <input v-model="user.email" type="email" id="email" placeholder="exemple@mail.com" required />

      <label for="password">Mot de passe</label>
      <input v-model="user.password" type="password" id="password" placeholder="••••••••" required />

      <button type="submit">S'enregistrer</button>
    </form>

    <p v-if="error" class="error-message">{{ error }}</p>
    <router-link to="/login" class="login-link">Déjà un compte ? Se connecter</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$store.dispatch('user/register', this.user);
        this.$router.push('/'); // Redirection après inscription
      } catch (err) {
        console.error(err);
      }
    },
  },
  computed: {
    error() {
      return this.$store.state.user.error;
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #444;
}

input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}

button {
  padding: 12px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #357abd;
}

.error-message {
  color: #e74c3c;
  margin-top: 10px;
  text-align: center;
}

.login-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #4a90e2;
  text-decoration: none;
  font-size: 14px;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
