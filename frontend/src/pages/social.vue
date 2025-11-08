<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />

    <div class="container mx-auto" style="max-width: 800px">
      <!-- Crear nuevo post -->
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold mb-4">Crea una publicació</h2>
        <textarea
          v-model="newPost"
          class="w-full bg-gray-800 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Què tens al cap?"
        ></textarea>
        <div class="flex justify-end">
          <button
            @click="addPost"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            Publicar
          </button>
        </div>
      </div>

      <!-- Llista de posts -->
      <div>
        <div
          v-for="post in posts"
          :key="post.id"
          class="p-4 border-b border-gray-700"
        >
          <div class="flex">
            <img
              :src="
                post.foto_perfil ||
                'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              "
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div class="w-full">
              <div class="flex items-center">
                <h3 class="text-lg font-semibold">{{ post.username }}</h3>
                <p class="text-gray-500 text-sm ml-2">
                  · {{ new Date(post.timestamp).toLocaleDateString() }}
                </p>
              </div>

              <p class="text-gray-300 mt-1">{{ post.content }}</p>

              <!-- Like + Comments -->
              <div class="flex items-center space-x-6 mt-4 text-gray-500">
                <button
                  @click="toggleLike(post.id)"
                  class="flex items-center space-x-2 hover:text-red-500"
                >
                  <svg
                    class="w-5 h-5"
                    :class="{
                      'text-red-500': post.likes.includes(
                        appStore.user?.username
                      ),
                    }"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>{{ post.likes.length }}</span>
                </button>

                <button
                  @click="post.showComments = !post.showComments"
                  class="flex items-center space-x-2 hover:text-blue-400"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>{{ post.comments.length }}</span>
                </button>
              </div>

              <!-- Comment Section -->
              <div v-if="post.showComments" class="mt-4">
                <div
                  v-for="comment in post.comments"
                  :key="comment.id"
                  class="text-gray-400 text-sm mb-2"
                >
                  <strong>{{ comment.username }}</strong
                  >:
                  {{ comment.text }}
                </div>

                <div class="flex mt-4">
                  <input
                    v-model="commentText[post.id]"
                    class="flex-1 bg-gray-800 p-2 rounded-l-lg outline-none"
                    placeholder="Escriu un comentari..."
                  />
                  <button
                    @click="addComment(post.id)"
                    class="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-lg font-semibold"
                  >
                    Enviar
                  </button>
                </div>
              </div>
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
