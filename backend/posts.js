import sequelize from "./database/sequelize.js";
import { findUserByUsername } from "./users.js";
import { v4 as uuidv4 } from "uuid";

// 🔹 Obtener todos los posts
export const getAllPosts = async () => {
  const [posts] = await sequelize.query(
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
    const [comments] = await sequelize.query(
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
      { replacements: [post.id] }
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
  await sequelize.query(
    "INSERT INTO Posts (id, content, userId) VALUES (?, ?, ?)",
    { replacements: [newPostId, content, user.id] }
  );

  const [[post]] = await sequelize.query(
    `SELECT
      p.id,
      p.content,
      p.createdAt as timestamp,
      u.username,
      u.foto_perfil
    FROM Posts p
    JOIN Usuaris u ON p.userId = u.id
    WHERE p.id = ?`,
    { replacements: [newPostId] }
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

  const [[post]] = await sequelize.query("SELECT id FROM Posts WHERE id = ?", {
    replacements: [postId],
  });
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const newCommentId = uuidv4();
  await sequelize.query(
    "INSERT INTO Comentaris (id, text, userId, postId) VALUES (?, ?, ?, ?)",
    { replacements: [newCommentId, text, user.id, postId] }
  );

  const [[comment]] = await sequelize.query(
    `SELECT
      c.id,
      c.text,
      c.createdAt as timestamp,
      u.username,
      u.foto_perfil
    FROM Comentaris c
    JOIN Usuaris u ON c.userId = u.id
    WHERE c.id = ?`,
    { replacements: [newCommentId] }
  );

  return comment;
};

// 🔹 Actualizar un post
export const updatePost = async (postId, username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const [[post]] = await sequelize.query("SELECT userId FROM Posts WHERE id = ?", {
    replacements: [postId],
  });
  if (!post) {
    return null;
  }

  if (post.userId !== user.id) {
    return null;
  }

  await sequelize.query("UPDATE Posts SET content = ? WHERE id = ?", {
    replacements: [content, postId],
  });

  const [[updatedPost]] = await sequelize.query("SELECT * FROM Posts WHERE id = ?", {
    replacements: [postId],
  });
  return updatedPost;
};

// 🔹 Eliminar post (solo autor)
export const deletePost = async (postId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [[post]] = await sequelize.query("SELECT userId FROM Posts WHERE id = ?", {
    replacements: [postId],
  });
  if (!post) {
    return false;
  }

  if (post.userId !== user.id) {
    return false;
  }

  await sequelize.query("DELETE FROM Posts WHERE id = ?", {
    replacements: [postId],
  });
  return true;
};

// 🔹 Eliminar comentario (solo autor)
export const deleteComment = async (postId, commentId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [[comment]] = await sequelize.query(
    "SELECT userId FROM Comentaris WHERE id = ? AND postId = ?",
    { replacements: [commentId, postId] }
  );
  if (!comment) {
    return false;
  }

  if (comment.userId !== user.id) {
    return false;
  }

  await sequelize.query("DELETE FROM Comentaris WHERE id = ?", {
    replacements: [commentId],
  });
  return true;
};
