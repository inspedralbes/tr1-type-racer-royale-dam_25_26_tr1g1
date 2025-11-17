import pool from "./database/mysql.js";
import { findUserByUsername } from "./users.js";
import { broadcast } from "./websocket.js";

// Helper function to process SQL results into nested post structure
const mapPosts = (rows) => {
  const posts = new Map();

  for (const row of rows) {
    if (!posts.has(row.post_id)) {
      posts.set(row.post_id, {
        id: row.post_id,
        content: row.post_content,
        timestamp: row.post_timestamp,
        authorType: row.post_authorType,
        username: row.post_author_username || "Muvvers",
        foto_perfil: row.post_author_foto_perfil || `https://robohash.org/Muvvers.png?bgset=bg1`,
        comments: [],
      });
    }

    if (row.comment_id) {
      posts.get(row.post_id).comments.push({
        id: row.comment_id,
        text: row.comment_text,
        timestamp: row.comment_timestamp,
        username: row.comment_author_username,
        foto_perfil: row.comment_author_foto_perfil,
      });
    }
  }

  return Array.from(posts.values());
};


// 🔹 Obtener todos los posts
export const getAllPosts = async () => {
  const sql = `
    SELECT
      p.id AS post_id,
      p.content AS post_content,
      p.createdAt AS post_timestamp,
      p.authorType as post_authorType,
      u_post.username AS post_author_username,
      u_post.foto_perfil AS post_author_foto_perfil,
      c.id AS comment_id,
      c.text AS comment_text,
      c.createdAt AS comment_timestamp,
      u_comment.username AS comment_author_username,
      u_comment.foto_perfil AS comment_author_foto_perfil
    FROM Posts AS p
    LEFT JOIN Usuaris AS u_post ON p.userId = u_post.id
    LEFT JOIN Comments AS c ON p.id = c.postId
    LEFT JOIN Usuaris AS u_comment ON c.userId = u_comment.id
    ORDER BY p.createdAt DESC, c.createdAt ASC;
  `;
  const [rows] = await pool.query(sql);
  return mapPosts(rows);
};

// 🔹 Crear un nuevo post
export const createPost = async (username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const sql = "INSERT INTO Posts (content, userId, authorType, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())";
  const [result] = await pool.query(sql, [content, user.id, "user"]);
  const newPostId = result.insertId;

  const postData = {
    id: newPostId,
    content: content,
    timestamp: new Date(),
    authorType: "user",
    username: user.username,
    foto_perfil: user.foto_perfil,
    comments: [],
  };

  broadcast("NEW_POST", postData);

  return postData;
};

// 🔹 Crear un nuevo post del sistema
export const createSystemPost = async (content) => {
    const sql = "INSERT INTO Posts (content, authorType, userId, createdAt, updatedAt) VALUES (?, 'system', NULL, NOW(), NOW())";
    const [result] = await pool.query(sql, [content]);

    const postData = {
        id: result.insertId,
        content: content,
        timestamp: new Date(),
        authorType: 'system',
        username: 'Muvvers',
        foto_perfil: `https://robohash.org/Muvvers.png?bgset=bg1`,
        comments: [],
    };

    broadcast("NEW_POST", postData); // Also broadcast system posts
    return postData;
};


// 🔹 Añadir comentario
export const addComment = async (postId, username, text) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const [posts] = await pool.query("SELECT id FROM Posts WHERE id = ?", [postId]);
  if (posts.length === 0) {
    throw new Error("POST_NOT_FOUND");
  }

  const sql = "INSERT INTO Comments (text, userId, postId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())";
  const [result] = await pool.query(sql, [text, user.id, postId]);
  const newCommentId = result.insertId;

  const commentData = {
    id: newCommentId,
    text: text,
    timestamp: new Date(),
    username: user.username,
    foto_perfil: user.foto_perfil,
  };

  broadcast("NEW_COMMENT", { ...commentData, postId });

  return commentData;
};

// 🔹 Actualizar un post
export const updatePost = async (postId, username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const [posts] = await pool.query("SELECT userId FROM Posts WHERE id = ?", [postId]);
  if (posts.length === 0 || posts[0].userId !== user.id) {
    return null;
  }

  const sql = "UPDATE Posts SET content = ?, updatedAt = NOW() WHERE id = ? AND userId = ?";
  await pool.query(sql, [content, postId, user.id]);

  // Returning the updated post data
  const [updatedPosts] = await pool.query("SELECT * FROM Posts WHERE id = ?", [postId]);
  return updatedPosts[0];
};

// 🔹 Eliminar post (solo autor)
export const deletePost = async (postId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [posts] = await pool.query("SELECT userId FROM Posts WHERE id = ?", [postId]);
   if (posts.length === 0 || posts[0].userId !== user.id) {
    return false;
  }

  // Assuming ON DELETE CASCADE for comments
  const [result] = await pool.query("DELETE FROM Posts WHERE id = ? AND userId = ?", [postId, user.id]);
  
  if (result.affectedRows > 0) {
    broadcast("DELETE_POST", { postId });
    return true;
  }
  return false;
};

// 🔹 Eliminar comentario (solo autor)
export const deleteComment = async (postId, commentId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const [comments] = await pool.query("SELECT userId FROM Comments WHERE id = ? AND postId = ?", [commentId, postId]);
  if (comments.length === 0 || comments[0].userId !== user.id) {
    return false;
  }

  const [result] = await pool.query("DELETE FROM Comments WHERE id = ? AND userId = ?", [commentId, user.id]);

  if (result.affectedRows > 0) {
    broadcast("DELETE_COMMENT", { postId, commentId });
    return true;
  }
  return false;
};
