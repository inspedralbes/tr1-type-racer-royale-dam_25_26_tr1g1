import fs from "fs";

import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const fsp = fs.promises;
const USERS_FILE = "./dades/usuaris.json";

let usuaris = [];


export const loadUsers = async () => {
  try {
    const data = await fsp.readFile(USERS_FILE, "utf8");
    usuaris = JSON.parse(data);
    console.log("Usuaris carregats correctament.");
    console.log(usuaris);
  } catch (error) {
    if (error.code === "ENOENT") {
      await saveUsers();
      console.log(
        "No s'ha trobat el fitxer d'usuaris, se n'ha creat un de nou."
      );
    } else {
      console.error("Error al carregar els usuaris:", error);
    }
  }
};

export const saveUsers = async () => {
  try {
    await fsp.writeFile(USERS_FILE, JSON.stringify(usuaris, null, 2));
  } catch (error) {
    console.error("Error al guardar els usuaris:", error);
  }
};

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
  };
  usuaris.push(newUser);
  await saveUsers();

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
  await saveUsers();
  return usuaris[userIndex];
};
