import { defineStore } from "pinia";
import { ref } from "vue";
import { useUsersStore } from "./users";
import { useAppStore } from "./app";

const API = import.meta.env.VITE_API_URL || "";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const usersStore = useUsersStore();
  const appStore = useAppStore();

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

  const createPost = async (content) => {
    const username = usersStore.getUser(appStore.userId)?.username;
    if (!content.trim() || !username) return;

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          content,
        }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  };

  const updatePost = async (postId, content) => {
    const username = usersStore.getUser(appStore.userId)?.username;
    if (!content.trim() || !username) return;

    try {
      const res = await fetch(`${API}/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          content,
        }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return await res.json();
    } catch (error) {
      console.error("Error updating post:", error);
      return null;
    }
  };

  const deletePost = async (postId) => {
    const username = usersStore.getUser(appStore.userId)?.username;
    if (!username) return false;

    try {
      const res = await fetch(`${API}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      return res.ok;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  };

  const addComment = async (postId, text) => {
    const username = usersStore.getUser(appStore.userId)?.username;
    if (!text?.trim() || !username) return;

    try {
      const res = await fetch(`${API}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          text,
        }),
      });
      return await res.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  };

  // Handlers for WebSocket events to be called from the component
  const handleNewPost = (post) => {
    if (!posts.value.some((p) => p.id === post.id)) {
      posts.value.unshift({
        ...post,
        showComments: false,
        showDropdown: false,
      });
    }
  };

  const handleNewComment = (comment) => {
    const post = posts.value.find((p) => p.id === comment.postId);
    if (post && !post.comments.some((c) => c.id === comment.id)) {
      post.comments.push(comment);
    }
  };

  const removePostById = (postId) => {
    posts.value = posts.value.filter((p) => p.id !== postId);
  };

  const updatePostContent = (postId, newContent) => {
    const index = posts.value.findIndex((p) => p.id === postId);
    if (index !== -1) {
      posts.value[index].content = newContent;
    }
  };

  return {
    posts,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    addComment,
    handleNewPost,
    handleNewComment,
    removePostById,
    updatePostContent,
  };
});
