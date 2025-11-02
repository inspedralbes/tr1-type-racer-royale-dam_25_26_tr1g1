import { v4 as uuidv4 } from "uuid";

let usuaris = [
  {
    id: "d9943aaa-5b81-4a77-8e63-9227f17405e9",
    username: "MartiCas",
    email: "marticastano@gmail.com",
    password: "123",
    pesoActual: 72,
    altura: 179,
    nivel: 1.3,
  },
  {
    id: "b2a0e634-dc43-4ee8-9c4e-9f9188e11b8e",
    username: "AngelCua",
    email: "angelcuadra@gmail.com",
    password: "123",
    pesoActual: 82,
    altura: 181,
    nivel: 2.5,
  },
  {
    id: "b3a0e634-dc43-4ee8-9c4e-9f9188e11b8e",
    username: "MariaCas",
    email: "maria@gmail.com",
    password: "123",
    pesoActual: 61,
    altura: 172,
    nivel: 0,
  },
  {
    id: "fa4ba09d-d074-4824-9b81-e3d2e42f0ed7",
    username: "PabloRod",
    email: "pablo@gmai.com",
    password: "123",
    pesoActual: "67",
    altura: 179,
    nivel: 0,
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
  altura
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
