import pool from "./database/db.js";
import { findUserByUsername } from "./users.js";
import { v4 as uuidv4 } from "uuid";

// 🔹 Obtener todos los posts
export const getAllPosts = async () => {
  const [posts] = await pool.query(
    `SELECT
      p.id,
      p.content,
      p.createdAt as timestamp,
      u.username,
      u.foto_perfil
    FROM Posts p
    JOIN Usuaris u ON p.userId = u.id
    ORDER BY p.createdAt DESC`
  );

  for (const post of posts) {
    const [comments] = await pool.query(
      `SELECT
        c.id,
        c.text,
        c.createdAt as timestamp,
        u.username,
        u.foto_perfil
      FROM Comentaris c
      JOIN Usuaris u ON c.userId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt ASC`,
      [post.id]
    );
    post.comments = comments;
  }

  return posts;
};

// 🔹 Crear un nuevo post
export const createPost = async (username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const newPostId = uuidv4();
  await pool.query(
    "INSERT INTO Posts (id, content, userId) VALUES (?, ?, ?)",
    [newPostId, content, user.id]
  );

  const [[post]] = await pool.query(
    `SELECT
      p.id,
      p.content,
      p.createdAt as timestamp,
      u.username,
      u.foto_perfil
    FROM Posts p
    JOIN Usuaris u ON p.userId = u.id
    WHERE p.id = ?`,
    [newPostId]
  );

  post.comments = [];
  return post;
};

// 🔹 Añadir comentario
export const addComment = async (postId, username, text) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const [[post]] = await pool.query("SELECT id FROM Posts WHERE id = ?", [
    postId,
  ]);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const newCommentId = uuidv4();
  await pool.query(
    "INSERT INTO Comentaris (id, text, userId, postId) VALUES (?, ?, ?, ?)",
    [newCommentId, text, user.id, postId]
  );

  const [[comment]] = await pool.query(
    `SELECT
      c.id,
      c.text,
      c.createdAt as timestamp,
      u.username,
      u.foto_perfil
    FROM Comentaris c
    JOIN Usuaris u ON c.userId = u.id
    WHERE c.id = ?`,
    [newCommentId]
  );

  return comment;
};

// 🔹 Actualizar un post
export const updatePost = async (postId, username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const [[post]] = await pool.query("SELECT userId FROM Posts WHERE id = ?", [
    postId,
  ]);
  if (!post) {
    return null;
  }

  if (post.userId !== user.id) {
    return null;
  }

  await pool.query("UPDATE Posts SET content = ? WHERE id = ?", [
    content,
    postId,
  ]);

  const [[updatedPost]] = await pool.query("SELECT * FROM Posts WHERE id = ?", [
    postId,
  ]);
  return updatedPost;
};

// 🔹 Eliminar post (solo autor)
export const deletePost = async (postId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [[post]] = await pool.query("SELECT userId FROM Posts WHERE id = ?", [
    postId,
  ]);
  if (!post) {
    return false;
  }

  if (post.userId !== user.id) {
    return false;
  }

  await pool.query("DELETE FROM Posts WHERE id = ?", [postId]);
  return true;
};

// 🔹 Eliminar comentario (solo autor)
export const deleteComment = async (postId, commentId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [[comment]] = await pool.query(
    "SELECT userId FROM Comentaris WHERE id = ? AND postId = ?",
    [commentId, postId]
  );
  if (!comment) {
    return false;
  }

  if (comment.userId !== user.id) {
    return false;
  }

  await pool.query("DELETE FROM Comentaris WHERE id = ?", [commentId]);
  return true;
};
