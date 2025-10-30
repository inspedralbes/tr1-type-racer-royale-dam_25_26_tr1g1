import fs from "fs";
const fsp = fs.promises;
const USERS_FILE = "./dades/usuaris.json";

let usuaris = [];

export const loadUsers = async () => {
  try {
    const data = await fsp.readFile(USERS_FILE, "utf8");
    usuaris = JSON.parse(data);
    console.log("Usuaris carregats correctament.");
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

export const findUserByUsername = (username) => {
  return usuaris.find((u) => u.username === username);
};

export const registerUser = async (username, email, password) => {
  if (findUserByUsername(username)) {
    throw new Error("USERNAME_EXISTS");
  }
  const newUser = { username, email, password };
  usuaris.push(newUser);
  await saveUsers();
  return newUser;
};

export const loginUser = (username, password) => {
  const user = usuaris.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) throw new Error("INVALID_CREDENTIALS");
  return user;
};
