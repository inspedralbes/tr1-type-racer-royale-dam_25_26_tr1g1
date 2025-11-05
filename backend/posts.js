import { v4 as uuidv4 } from "uuid";

let posts = [
  {
    id: uuidv4(),
    username: "MartiCas",
    content: "Just finished a great workout session! #fitness #motivation",
    timestamp: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    username: "AngelCua",
    content: "Loving the new features on this platform! The AI analysis is amazing.",
    timestamp: new Date().toISOString(),
  },
];

export const getAllPosts = () => {
  return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const createPost = (username, content) => {
  const newPost = {
    id: uuidv4(),
    username,
    content,
    timestamp: new Date().toISOString(),
  };
  posts.push(newPost);
  return newPost;
};
