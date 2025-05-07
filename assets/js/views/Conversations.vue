<template>
    <div class="conversations-container">
      <div class="conversations-card">
        <div class="conversations-header">
          Vos conversations
        </div>
        <div class="conversations-body">
          <!-- <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div> -->
  
          <ul class="conversation-list">
            <li
              v-for="conversation in conversations"
              :key="conversation.id"
              @click="openChat(conversation.users.find((user)=>user.id != this.user.id))"
              class="conversation-item"
            >
              <div class="conversation-info">
                <strong>Conversation #{{ conversation.id }}</strong>
                <div class="conversation-participants">
                  {{ conversation.users.find((user)=>user.id != this.user.id).email }}
                </div>
              </div>
              <div class="conversation-badge">
                
              </div>
            </li>
          </ul>
  
          <div v-if="conversations.length === 0 && !loading" class="no-conversations">
            Aucune conversation pour le moment.
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('conversation', ['conversations']),
  },
  methods: {
    ...mapActions('conversation', ['fetchAllConversations']),
    openChat(user) {
      this.$router.push(`/chat/${user.id}`);
    },
  },

  async mounted() {
    await this.fetchAllConversations();
  },

  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
};
</script>
  
  <style scoped>
  .conversations-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
  }
  
  .conversations-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }
  
  .conversations-header {
    background-color: #3490dc;
    color: #fff;
    font-size: 1.25rem;
    padding: 15px 20px;
    font-weight: bold;
  }
  
  .conversations-body {
    padding: 20px;
  }
  
  .loading {
    text-align: center;
    color: #555;
  }
  
  .spinner {
    margin: 0 auto 10px;
    width: 30px;
    height: 30px;
    border: 3px solid #ccc;
    border-top: 3px solid #3490dc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .conversation-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .conversation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
    cursor: pointer;
  }
  
  .conversation-item:hover {
    background-color: #f5f8fa;
  }
  
  .conversation-info {
    display: flex;
    flex-direction: column;
  }
  
  .conversation-participants {
    font-size: 0.875rem;
    color: #777;
    margin-top: 4px;
  }
  
  .conversation-badge {
    background-color: #e2e8f0;
    color: #333;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .no-conversations {
    text-align: center;
    color: #999;
    margin-top: 20px;
    font-size: 0.95rem;
  }
  </style>
  