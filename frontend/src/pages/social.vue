<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NavBar />

    <div class="container mx-auto p-4 pb-40" style="max-width: 800px">
      <!-- Crear nuevo post -->
      <div
        class="p-4 bg-gray-800/50 rounded-2xl mb-6 border border-gray-700/50 backdrop-blur-sm"
      >
        <h2 class="text-xl font-semibold mb-4">Crea una publicació</h2>
        <div class="flex items-start">
          <img
            :src="currentUser?.foto_perfil || DEFAULT_AVATAR"
            alt="Avatar"
            class="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <textarea
            v-model="newPostContent"
            class="w-full bg-gray-800 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            :placeholder="`Què tens al cap, ${
              currentUser?.username || 'convidat'
            }?`"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            @click="addPost"
            :disabled="!newPostContent.trim()"
            class="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors"
          >
            Publicar
          </button>
        </div>
      </div>

      <!-- Llista de posts -->
      <div class="space-y-4">
        <div
          v-for="post in posts"
          :key="post.id"
          class="p-4 rounded-2xl border border-gray-700/50 bg-gray-800/40 shadow-lg backdrop-blur-sm"
          :class="{ 'bg-sky-500/10': post.authorType === 'system' }"
        >
          <div class="flex">
            <img
              :src="post.foto_perfil || DEFAULT_AVATAR"
              alt="Avatar"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div class="w-full">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <h3 class="text-lg font-semibold">{{ post.username }}</h3>
                  <p class="text-gray-500 text-sm ml-2">
                    · {{ timeAgo(post.timestamp) }}
                  </p>
                </div>
                <!-- Dropdown for edit/delete -->
                <div
                  v-if="currentUser && currentUser.username === post.username"
                  class="relative"
                >
                  <button
                    @click="post.showDropdown = !post.showDropdown"
                    class="text-gray-400 hover:text-white"
                  >
                    <i class="mdi mdi-dots-horizontal"></i>
                  </button>
                  <div
                    v-if="post.showDropdown"
                    class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10"
                    @click.away="post.showDropdown = false"
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
                  class="w-full bg-gray-700 text-white p-2 rounded-lg mt-2"
                  rows="3"
                ></textarea>
                <div class="flex justify-end mt-2 space-x-2">
                  <button
                    @click="cancelEditing"
                    class="text-gray-400 hover:text-white px-3 py-1 rounded-full"
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
              <p v-else class="text-gray-300 mt-1 whitespace-pre-wrap">
                {{ post.content }}
              </p>

              <!-- Post Actions -->
              <div class="flex items-center justify-end mt-4 text-gray-500">
                <button
                  @click="post.showComments = !post.showComments"
                  class="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                >
                  <i class="mdi mdi-comment-processing-outline"></i>
                  <span>{{ post.comments.length }}</span>
                </button>
              </div>

              <!-- Comment Section -->
              <div
                v-if="post.showComments"
                class="mt-4 border-t border-gray-700/50 pt-4"
              >
                <!-- Add comment form -->
                <div class="flex items-center mb-4">
                  <img
                    :src="currentUser?.foto_perfil || DEFAULT_AVATAR"
                    alt="Avatar"
                    class="w-9 h-9 rounded-full mr-3 object-cover"
                  />
                  <input
                    v-model="commentText[post.id]"
                    @keyup.enter="addComment(post.id)"
                    class="flex-1 bg-gray-700 text-white p-2 rounded-full outline-none px-4 focus:ring-2 focus:ring-blue-500"
                    placeholder="Escriu un comentari..."
                  />
                  <button
                    @click="addComment(post.id)"
                    class="bg-blue-600 hover:bg-blue-700 p-2 rounded-full ml-2"
                  >
                    <i class="mdi mdi-send"></i>
                  </button>
                </div>
                <!-- List of comments -->
                <div class="space-y-3">
                  <div
                    v-for="comment in post.comments"
                    :key="comment.id"
                    class="flex items-start"
                  >
                    <img
                      :src="comment.foto_perfil || DEFAULT_AVATAR"
                      alt="Avatar"
                      class="w-8 h-8 rounded-full mr-3 object-cover"
                    />
                    <div
                      class="bg-gray-700/50 rounded-lg px-3 py-2 text-sm w-full"
                    >
                      <strong class="font-semibold text-white">{{
                        comment.username
                      }}</strong>
                      <p class="text-gray-300">{{ comment.text }}</p>
                    </div>
                  </div>
                  <p
                    v-if="!post.comments.length"
                    class="text-gray-500 text-sm text-center pt-2"
                  >
                    No hi ha comentaris encara.
                  </p>
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
      class="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm"
    >
      <div
        class="bg-gray-800 border border-gray-700 text-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
      >
        <h2 class="text-xl font-bold mb-4">Eliminar Publicació</h2>
        <p class="text-gray-300">
          Estàs segur que vols eliminar aquesta publicació?
        </p>
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="isDeleteDialogOpen = false"
            class="px-5 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel·lar
          </button>
          <button
            @click="confirmDelete"
            class="px-5 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import NavBar from "@/components/NavBar.vue";
import { useAppStore } from "@/stores/app";
import { useUsersStore } from "@/stores/users";
import { useWebSocketStore } from "@/stores/websocket";
import { usePostsStore } from "@/stores/posts";
import { timeAgo } from "@/utils/time.js";
import { DEFAULT_AVATAR } from "@/constants.js";

const appStore = useAppStore();
const usersStore = useUsersStore();
const websocketStore = useWebSocketStore();
const postsStore = usePostsStore();

const { posts } = storeToRefs(postsStore);

const newPostContent = ref("");
const commentText = ref({});
const editingPost = ref(null);
const editedContent = ref("");
const isDeleteDialogOpen = ref(false);
const postToDeleteId = ref(null);

const currentUser = computed(() => {
  if (appStore.userId) {
    return usersStore.getUser(appStore.userId);
  }
  return null;
});

watch(
  () => appStore.userId,
  (newUserId) => {
    if (newUserId && !usersStore.users[newUserId]) {
      usersStore.fetchUser(newUserId);
    }
  },
  { immediate: true }
);

const addPost = async () => {
  const newPost = await postsStore.createPost(newPostContent.value);
  if (newPost) {
    // Manually add for instant feedback; websocket handles others & prevents duplicates.
    postsStore.handleNewPost(newPost);
    newPostContent.value = "";
  }
};

const addComment = async (postId) => {
  const text = commentText.value[postId];
  const newComment = await postsStore.addComment(postId, text);
  if (newComment) {
    // Manually add for instant feedback; websocket handles others & prevents duplicates.
    postsStore.handleNewComment({ ...newComment, postId });
    commentText.value[postId] = "";
  }
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
  const success = await postsStore.deletePost(postToDeleteId.value);
  if (success) {
    postsStore.removePostById(postToDeleteId.value);
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
  const updatedPost = await postsStore.updatePost(postId, editedContent.value);
  if (updatedPost) {
    postsStore.updatePostContent(postId, updatedPost.content);
    cancelEditing();
  }
};

onMounted(() => {
  postsStore.fetchPosts();
});
</script>
