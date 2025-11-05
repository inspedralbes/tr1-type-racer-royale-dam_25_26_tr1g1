import { v4 as uuidv4 } from "uuid";

let usuaris = [
  {
    id: "d9943aaa-5b81-4a77-8e63-9227f17405e9",
    username: "MartiCas",
    email: "marticastano@gmail.com",
    password: "123",
    biografia: "",
    pesoActual: 72,
    altura: 179,
    nivel: 1.3,
    foto_perfil:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmo8qa7GyzEds7vEgBzYWrlEKxeIz2xJXVXOYwGMsixIx7zPBgus1_DOxmGt0HDSCEAQrixKNtEJLfQ0qPeu3BlLqkOUVeA1u17kC5torfZw&s=10",
  },
  {
    id: "b2a0e634-dc43-4ee8-9c4e-9f9188e11b8e",
    username: "AngelCua",
    email: "angelcuadra@gmail.com",
    password: "123",
    biografia: "",
    pesoActual: 82,
    altura: 181,
    nivel: 2.5,
    foto_perfil:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPvzwn6PJmPGfH5rBK9vOyIXMzEd1hRM9Oov2blPuhLrB1ItnMZnBmoa8H7ovhu6KOF6rV28U4SzLqYCYMGoqfc5x3Gt0mjvRUWCScfWLk&s=10",
  },
  {
    id: "b3a0e634-dc43-4ee8-9c4e-9f9188e11b8e",
    username: "MariaCas",
    email: "maria@gmail.com",
    password: "123",
    biografia: "",
    pesoActual: 61,
    altura: 172,
    nivel: 0,
    foto_perfil:
      "https://www.google.com/search?sa=X&sca_esv=158cb2df441fc0a8&biw=1920&bih=999&sxsrf=AE3TifMmu5iFd5VRE2Yn3QOL6c2n_yxi1A:1762354184733&q=%C3%81guila+calva&stick=H4sIAAAAAAAAAONgFuLQz9U3sEwuzlECswxTKiy07LOTrfSTMvNz8tMr9TPz0vKLchNz4iECmclAZnpRfmlBZl66VVFqQVFqcWpeSWJJZlmqQnFBanJmavEiVt7DjemlmTmJCkDVZYkAhySzrmcAAAA&ved=2ahUKEwj25Jj5oNuQAxXpVKQEHdSJHSUQgOQBegQIIRAG",
  },
  {
    id: "fa4ba09d-d074-4824-9b81-e3d2e42f0ed7",
    username: "PabloRod",
    email: "pablo@gmai.com",
    password: "123",
    biografia: "",
    pesoActual: "67",
    altura: 179,
    nivel: 0,
    foto_perfil: "https://www.w3schools.com/howto/img_avatar.png",
  },
];

export const findUserById = (id) => {
  return usuaris.find((u) => u.id === id);
};

export const findUserByUsername = (username) => {
  return usuaris.find((u) => u.username === username);
};

export const registerUser = async (
  username,
  email,
  password,
  pesoActual,
  altura,
  biografia,
  foto_perfil
) => {
  if (findUserByUsername(username)) {
    throw new Error("USERNAME_EXISTS");
  }
  let newId;
  do {
    newId = uuidv4();
  } while (findUserById(newId));

  const newUser = {
    id: newId,
    username,
    email,
    password,
    pesoActual,
    altura,
    date_created: new Date(),
    nivel: 0,
    biografia,
    foto_perfil: foto_perfil || "",
  };
  usuaris.push(newUser);

  return { user: newUser };
};

export const loginUser = (username, password) => {
  const user = usuaris.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("INVALID_CREDENTIALS");

  return { user };
};

export const updateUser = async (id, updateData) => {
  const userIndex = usuaris.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new Error("USER_NOT_FOUND");
  }

  usuaris[userIndex] = { ...usuaris[userIndex], ...updateData };
  return usuaris[userIndex];
};
