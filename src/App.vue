<template>
  <div id="app">
    <h1>文章管理</h1>
    <form @submit.prevent="submitForm">
      <label for="title">标题:</label>
      <input type="text" id="title" v-model="title" required />

      <label for="content">内容:</label>
      <textarea id="content" v-model="content" required></textarea>

      <button type="submit">提交</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <ul>
      <li v-for="article in articles" :key="article.id">
        {{ article.title }}
        <button @click="editArticle(article.id)">编辑</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const apiUrl = 'http://localhost:3000/articles';
const title = ref('');
const content = ref('');
const message = ref('');
const articles = ref([]);

async function fetchArticles() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  articles.value = data;
}

async function submitForm() {
  const payload = {
    title: title.value,
    content: content.value
  };

  if (!payload.title || !payload.content) {
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const newArticle = await response.json();
  articles.value.push(newArticle);
  title.value = '';
  content.value = '';
  message.value = '文章已成功添加！';
}

async function editArticle(id) {
  const payload = {
    title: title.value,
    content: content.value
  };

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const updatedArticle = await response.json();
  const index = articles.value.findIndex((article) => article.id === id);
  articles.value.splice(index, 1, updatedArticle);
  title.value = '';
  content.value = '';
  message.value = '文章已成功更新！';
}

onMounted(fetchArticles);
</script>

<style lang="less">
#app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;

  label {
    margin-top: 1rem;
  }

  input,
  textarea {
    margin-top: 0.5rem;
  }

  button {
    margin-top: 1rem;
  }
}

.message {
  margin-top: 1rem;
  color: green;
}
</style>
