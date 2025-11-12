import { User, Post, Comment } from "./models/index.js";
import { findUserByUsername } from "./users.js";

// 🔹 Obtener todos los posts
export const getAllPosts = async () => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: ["username", "foto_perfil"],
        required: true, // Un post ha de tenir autor
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "foto_perfil"],
          },
        ],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return posts.map((post) => {
    return {
      id: post.id,
      content: post.content,
      timestamp: post.createdAt,
      username: post.author.username,
      foto_perfil: post.author.foto_perfil,
      comments: post.Comments.filter((comment) => comment.author)
        .map((comment) => {
          return {
            id: comment.id,
            text: comment.text,
            timestamp: comment.createdAt,
            username: comment.author.username,
            foto_perfil: comment.author.foto_perfil,
          };
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    };
  });
};

// 🔹 Crear un nuevo post
export const createPost = async (username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const newPost = await Post.create({
    content,
    userId: user.id,
  });

  const postWithAuthor = await Post.findByPk(newPost.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["username", "foto_perfil"],
      },
    ],
  });

  return {
    id: postWithAuthor.id,
    content: postWithAuthor.content,
    timestamp: postWithAuthor.createdAt,
    username: postWithAuthor.author.username,
    foto_perfil: postWithAuthor.author.foto_perfil,
    comments: [],
  };
};

// 🔹 Añadir comentario
export const addComment = async (postId, username, text) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const newComment = await Comment.create({
    text,
    postId,
    userId: user.id,
  });

  const commentWithAuthor = await Comment.findByPk(newComment.id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["username", "foto_perfil"],
      },
    ],
  });

  return {
    id: commentWithAuthor.id,
    text: commentWithAuthor.text,
    timestamp: commentWithAuthor.createdAt,
    username: commentWithAuthor.author.username,
    foto_perfil: commentWithAuthor.author.foto_perfil,
  };
};

// 🔹 Actualizar un post
export const updatePost = async (postId, username, content) => {
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const post = await Post.findByPk(postId);
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

  const post = await Post.findByPk(postId);
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

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return false;
  }

  if (comment.userId !== user.id) {
    return false;
  }

  await comment.destroy();
  return true;
};