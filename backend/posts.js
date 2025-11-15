import db from "./models/index.js";
import { findUserByUsername } from "./users.js";

// 🔹 Obtener todos los posts
export const getAllPosts = async () => {
  const posts = await db.Post.findAll({
    attributes: ["id", "content", ["createdAt", "timestamp"], "authorType"],
    include: [
      {
        model: db.User,
        as: "user",
        attributes: ["username", "foto_perfil"],
        required: false,
      },
      {
        model: db.Comment,
        as: "comments",
        attributes: ["id", "text", ["createdAt", "timestamp"]],
        include: {
          model: db.User,
          as: "user",
          attributes: ["username", "foto_perfil"],
        },
      },
    ],
    order: [
      ["createdAt", "DESC"],
      [{ model: db.Comment, as: "comments" }, "createdAt", "ASC"],
    ],
  });

  return posts.map((post) => {
    const plainPost = post.get({ plain: true });
    return {
      id: plainPost.id,
      content: plainPost.content,
      timestamp: plainPost.timestamp,
      authorType: plainPost.authorType,
      username: plainPost.user ? plainPost.user.username : "Muvvers",
      foto_perfil: plainPost.user ? plainPost.user.foto_perfil : `https://robohash.org/Muvvers.png?bgset=bg1`,
      comments: (plainPost.comments || []).map((comment) => ({
        id: comment.id,
        text: comment.text,
        timestamp: comment.timestamp,
        username: comment.user.username,
        foto_perfil: comment.user.foto_perfil,
      })),
    };
  });
};

// 🔹 Crear un nuevo post
export const createPost = async (username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const newPost = await db.Post.create({
    content: content,
    userId: user.id,
    authorType: "user",
  });

  const postWithUser = await db.Post.findByPk(newPost.id, {
    include: {
      model: db.User,
      as: "user",
      attributes: ["username", "foto_perfil"],
    },
  });

  return {
    id: postWithUser.id,
    content: postWithUser.content,
    timestamp: postWithUser.createdAt,
    authorType: postWithUser.authorType,
    username: postWithUser.user.username,
    foto_perfil: postWithUser.user.foto_perfil,
    comments: [],
  };
};

// 🔹 Crear un nuevo post del sistema
export const createSystemPost = async (content) => {
  const newPost = await db.Post.create({
    content: content,
    authorType: 'system',
    userId: null, // No user for system posts
  });

  return {
    id: newPost.id,
    content: newPost.content,
    timestamp: newPost.createdAt,
    authorType: newPost.authorType,
    username: 'Muvvers',
    foto_perfil: `https://robohash.org/Muvvers.png?bgset=bg1`,
    comments: [],
  };
};

// 🔹 Añadir comentario
export const addComment = async (postId, username, text) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const post = await db.Post.findByPk(postId);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const newComment = await db.Comment.create({
    text: text,
    userId: user.id,
    postId: postId,
  });

  const commentWithUser = await db.Comment.findByPk(newComment.id, {
    include: {
      model: db.User,
      as: "user",
      attributes: ["username", "foto_perfil"],
    },
  });

  return {
    id: commentWithUser.id,
    text: commentWithUser.text,
    timestamp: commentWithUser.createdAt,
    username: commentWithUser.user.username,
    foto_perfil: commentWithUser.user.foto_perfil,
  };
};

// 🔹 Actualizar un post
export const updatePost = async (postId, username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const post = await db.Post.findByPk(postId);
  if (!post) {
    return null;
  }

  if (post.userId !== user.id) {
    return null;
  }

  post.content = content;
  await post.save();

  return post;
};

// 🔹 Eliminar post (solo autor)
export const deletePost = async (postId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const post = await db.Post.findByPk(postId);
  if (!post) {
    return false;
  }

  if (post.userId !== user.id) {
    return false;
  }

  await post.destroy();
  return true;
};

// 🔹 Eliminar comentario (solo autor)
export const deleteComment = async (postId, commentId, username) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return false;
  }

  const comment = await db.Comment.findOne({
    where: { id: commentId, postId: postId },
  });

  if (!comment) {
    return false;
  }

  if (comment.userId !== user.id) {
    return false;
  }

  await comment.destroy();
  return true;
};
