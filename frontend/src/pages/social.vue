<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Social</h1>

      <!-- Crear nuevo post -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-xl font-semibold mb-4">Crea una publicació</h2>
        <textarea
          v-model="newPost"
          class="w-full bg-gray-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Què tens al cap?"
        ></textarea>
        <button
          @click="addPost"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          Publicar
        </button>
      </div>

      <!-- Llista de posts -->
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
              <p class="text-gray-400 text-sm">
                {{ new Date(post.timestamp).toLocaleString() }}
              </p>
            </div>
          </div>

          <p class="text-gray-300 mb-4">{{ post.content }}</p>

          <!-- Like + Comments -->
          <div class="flex items-center space-x-6 mb-4">
            <button
              @click="toggleLike(post.id)"
              class="flex items-center space-x-1 hover:text-blue-400"
            >
              <span
                :class="{
                  'text-blue-400': post.likes.includes(appStore.user?.username),
                }"
              >
                ❤️
              </span>
              <span>{{ post.likes.length }}</span>
            </button>

            <button
              @click="post.showComments = !post.showComments"
              class="hover:text-blue-400"
            >
              💬 {{ post.comments.length }}
            </button>
          </div>

          <!-- Comment Section -->
          <div
            v-if="post.showComments"
            class="mt-4 border-t border-gray-700 pt-4"
          >
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="mb-2 text-gray-300"
            >
              <strong>{{ comment.username }}</strong
              >:
              {{ comment.text }}
            </div>

            <div class="flex mt-2">
              <input
                v-model="commentText[post.id]"
                class="flex-1 bg-gray-700 p-2 rounded-l-lg outline-none"
                placeholder="Escriu un comentari..."
              />
              <button
                @click="addComment(post.id)"
                class="bg-blue-600 hover:bg-blue-700 px-3 rounded-r-lg"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const newPost = ref("");
const posts = ref([]);
const commentText = ref({});

const API = import.meta.env.VITE_API_URL || "";

const fetchPosts = async () => {
  try {
    const res = await fetch(`${API}/api/posts`);
    const data = await res.json();
    posts.value = data.map((p) => ({ ...p, showComments: false }));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const addPost = async () => {
  if (!newPost.value.trim() || !appStore.user) return;

  const res = await fetch(`${API}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: appStore.user.username,
      content: newPost.value,
    }),
  });
  const data = await res.json();
  posts.value.unshift({ ...data, showComments: false });
  newPost.value = "";
};

const toggleLike = async (id) => {
  if (!appStore.user) return;
  const res = await fetch(`${API}/api/posts/${id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: appStore.user.username }),
  });
  const updated = await res.json();
  const index = posts.value.findIndex((p) => p.id === id);
  if (index !== -1)
    posts.value[index] = {
      ...updated,
      showComments: posts.value[index].showComments,
    };
};

const addComment = async (postId) => {
  const text = commentText.value[postId];
  if (!text?.trim() || !appStore.user) return;

  const res = await fetch(`${API}/api/posts/${postId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: appStore.user.username,
      text,
    }),
  });

  const newComment = await res.json();
  const post = posts.value.find((p) => p.id === postId);
  post.comments.push(newComment);
  commentText.value[postId] = "";
};
onMounted(fetchPosts);
</script>
