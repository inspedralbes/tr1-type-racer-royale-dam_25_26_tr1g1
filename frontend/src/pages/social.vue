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
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <h3 class="text-lg font-semibold">{{ post.username }}</h3>
                  <p class="text-gray-500 text-sm ml-2">
                    · {{ new Date(post.timestamp).toLocaleDateString() }}
                  </p>
                </div>
                <!-- Dropdown for edit/delete -->
                <div
                  v-if="appStore.user && appStore.user.username === post.username"
                  class="relative"
                >
                  <button
                    @click="post.showDropdown = !post.showDropdown"
                    class="text-gray-400 hover:text-white"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                      ></path>
                    </svg>
                  </button>
                  <div
                    v-if="post.showDropdown"
                    class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10"
                  >
                    <a
                      @click="startEditing(post)"
                      class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >Editar</a
                    >
                    <a
                      @click="openDeleteDialog(post.id)"
                      class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 cursor-pointer"
                      >Eliminar</a
                    >
                  </div>
                </div>
              </div>

              <!-- Edit mode -->
              <div v-if="editingPost && editingPost.id === post.id">
                <textarea
                  v-model="editedContent"
                  class="w-full bg-gray-800 text-white p-2 rounded-lg mt-2"
                  rows="3"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="cancelEditing"
                    class="text-gray-400 hover:text-white mr-2"
                  >
                    Cancel·lar
                  </button>
                  <button
                    @click="updatePost(post.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
                  >
                    Guardar
                  </button>
                </div>
              </div>
              <!-- Normal mode -->
              <p v-else class="text-gray-300 mt-1">{{ post.content }}</p>

              <!-- Comments -->
              <div class="flex items-center space-x-6 mt-4 text-gray-500">
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

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="isDeleteDialogOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div
        class="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-sm"
      >
        <h2 class="text-xl font-bold mb-4">Eliminar Publicació</h2>
        <p>Estàs segur que vols eliminar aquesta publicació?</p>
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="isDeleteDialogOpen = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel·lar
          </button>
          <button
            @click="confirmDelete"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirmar
          </button>
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
const editingPost = ref(null);
const editedContent = ref("");
const isDeleteDialogOpen = ref(false);
const postToDeleteId = ref(null);

const API = import.meta.env.VITE_API_URL || "";

const fetchPosts = async () => {
  try {
    const res = await fetch(`${API}/api/posts`);
    const data = await res.json();
    posts.value = data.map((p) => ({
      ...p,
      showComments: false,
      showDropdown: false,
    }));
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
  posts.value.unshift({ ...data, showComments: false, showDropdown: false });
  newPost.value = "";
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

const openDeleteDialog = (postId) => {
  postToDeleteId.value = postId;
  isDeleteDialogOpen.value = true;
  const post = posts.value.find((p) => p.id === postId);
  if (post) {
    post.showDropdown = false;
  }
};

const confirmDelete = async () => {
  if (!appStore.user) return;

  const res = await fetch(`${API}/api/posts/${postToDeleteId.value}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: appStore.user.username }),
  });

  if (res.ok) {
    posts.value = posts.value.filter((p) => p.id !== postToDeleteId.value);
  } else {
    alert("No s'ha pogut eliminar la publicació.");
  }
  isDeleteDialogOpen.value = false;
};
const startEditing = (post) => {
  editingPost.value = post;
  editedContent.value = post.content;
  post.showDropdown = false;
};

const cancelEditing = () => {
  editingPost.value = null;
  editedContent.value = "";
};

const updatePost = async (postId) => {
  if (!editedContent.value.trim() || !appStore.user) return;

  const res = await fetch(`${API}/api/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: appStore.user.username,
      content: editedContent.value,
    }),
  });

  if (res.ok) {
    const updatedPost = await res.json();
    const index = posts.value.findIndex((p) => p.id === postId);
    if (index !== -1) {
      posts.value[index].content = updatedPost.content;
    }
    cancelEditing();
  } else {
    alert("No s'ha pogut actualitzar la publicació.");
  }
};

onMounted(fetchPosts);
</script>
