<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="submitForm" class="login-form">
      <label for="email">Email</label>
      <input v-model="email" type="text" id="email" required />

      <label for="password">Mot de passe</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Se connecter</button>
    </form>

    <p v-if="error" class="error-message">{{ error }}</p>
    <router-link to="/register" class="register-link">Pas encore de compte ? S'inscrire</router-link>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapState('user', ['error']),
  },
  methods: {
    ...mapActions('user', ['login']),
    async submitForm() {
      try {
        await this.login({
          email: this.email,
          password: this.password,
        });
        this.$router.push('/');
      } catch (error) {
        console.error('Erreur de connexion :', error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
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

.login-form {
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

.register-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #4a90e2;
  text-decoration: none;
  font-size: 14px;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
