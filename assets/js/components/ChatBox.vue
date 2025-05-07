<template>
  <div class="chat-box">
    <h2>Chat avec {{ recipient?.email }}</h2>

    <div class="messages" ref="messagesContainer">
      <div
        v-for="msg in conversation.messages"
        :key="msg.id"
        :class="['message', msg.author.id === user.id ? 'sent' : 'received']"
      >
        <p>{{ msg.content }}</p>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="newMessage"
        placeholder="Écrivez un message..."
        @keyup.enter="handleSendMessage"
      />
      <button @click="handleSendMessage">Envoyer</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      newMessage: '',
      recipient: null,
      eventSource: null,
    };
  },
  computed: {
    ...mapGetters('user', ['user', 'users']),
    ...mapGetters('conversation', ['conversation', 'topic']),
  },
  methods: {
    ...mapActions('conversation', ['fetchConversation', 'appendMessage']),
    ...mapActions('message', ['sendMessage']),
    ...mapActions('user', ['fetchUsers']),

    async loadMessages() {
      const recipientId = this.$route.params.id;
      await this.fetchConversation(recipientId);
      this.recipient = this.users.find((u) => u.id == recipientId);
      this.initSSE();
    },

    async handleSendMessage() {
      if (!this.newMessage.trim()) return;

      await this.sendMessage({
        conversationId: this.conversation.id,
        content: this.newMessage,
      });

      this.newMessage = '';
    },

    initSSE() {
      console.log(this.topic)
      const topic = this.topic; // adapte l’URL à ton topic
      const url = new URL('https://localhost/.well-known/mercure'); // adapte selon ta config
      url.searchParams.append('topic', topic);

      this.eventSource = new EventSource(url, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { content, authorId } = data;

        this.appendMessage({
          id: Date.now(), // ou un ID unique si fourni
          content,
          author: { id: authorId },
        });

        // Scroll vers le bas après réception
        this.$nextTick(() => {
          this.scrollToBottom();
        });

        if (authorId === this.user.id) {
          this.newMessage = '';
        }
      };
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },
  },

  async mounted() {
    await this.fetchUsers();
    await this.loadMessages();
  },

  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
};
</script>
<style scoped>
.chat-box {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.messages {
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.sent {
  background-color: #d1e7ff;
  text-align: right;
}

.received {
  background-color: #f0f0f0;
  text-align: left;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>