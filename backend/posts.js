import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { findUserByUsername } from "./users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_FILE = path.join(__dirname, "posts.json");

// 📂 Cargar posts desde archivo
let posts = [];
try {
  const data = fs.readFileSync(POSTS_FILE, "utf8");
  posts = JSON.parse(data);
} catch (err) {
  console.warn("⚠️ No se pudo cargar posts.json, se iniciará vacío");
  posts = [];
}

// 💾 Guardar en archivo
const savePosts = () => {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
};

// 🔹 Obtener todos los posts
export const getAllPosts = () => {
  return posts
    .map((post) => {
      const user = findUserByUsername(post.username);
      return {
        ...post,
        foto_perfil: user?.foto_perfil || post.foto_perfil || "",
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// 🔹 Crear un nuevo post
export const createPost = (username, content) => {
  const user = findUserByUsername(username);
  const newPost = {
    id: uuidv4(),
    username,
    foto_perfil: user?.foto_perfil || "",
    content,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
  };
  posts.push(newPost);
  savePosts();
  return newPost;
};

// 🔹 Dar o quitar like
export const toggleLike = (postId, username) => {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const alreadyLiked = post.likes.includes(username);
  if (alreadyLiked) {
    post.likes = post.likes.filter((u) => u !== username);
  } else {
    post.likes.push(username);
  }

  savePosts();
  return post;
};

// 🔹 Añadir comentario
export const addComment = (postId, username, text) => {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const user = findUserByUsername(username);
  const newComment = {
    id: uuidv4(),
    username,
    foto_perfil: user?.foto_perfil || "",
    text,
    timestamp: new Date().toISOString(),
  };

  post.comments.push(newComment);
  savePosts();
  return newComment;
};

// 🔹 Eliminar post (solo autor)
export const deletePost = (postId, username) => {
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return false;

  if (posts[index].username !== username) return false;

  posts.splice(index, 1);
  savePosts();
  return true;
};

// 🔹 Eliminar comentario (solo autor)
export const deleteComment = (postId, commentId, username) => {
  const post = posts.find((p) => p.id === postId);
  if (!post) return false;

  const commentIndex = post.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) return false;

  if (post.comments[commentIndex].username !== username) return false;

  post.comments.splice(commentIndex, 1);
  savePosts();
  return true;
};
