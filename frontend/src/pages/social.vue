<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Social</h1>

      <!-- New Post Form -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">Create a new post</h2>
        <textarea
          v-model="newPost"
          class="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="What's on your mind?"
        ></textarea>
        <button
          @click="addPost"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          Post
        </button>
      </div>

      <!-- Posts Feed -->
      <div class="space-y-6">
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div class="flex items-center mb-4">
            <img
              :src="`https://randomuser.me/api/portraits/men/${post.username.length}.jpg`"
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 class="text-lg font-semibold">{{ post.username }}</h3>
              <p class="text-gray-400 text-sm">{{ new Date(post.timestamp).toLocaleString() }}</p>
            </div>
          </div>
          <p class="text-gray-300">{{ post.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from "@/components/NavBar.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const newPost = ref('');
const posts = ref([]);

const fetchPosts = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
    const data = await res.json();
    posts.value = data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const addPost = async () => {
  if (newPost.value.trim() === '' || !appStore.user) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: appStore.user.username,
        content: newPost.value,
      }),
    });
    const data = await res.json();
    posts.value.unshift(data);
    newPost.value = '';
    fetchPosts();
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>