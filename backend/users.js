/*import { v4 as uuidv4 } from "uuid";

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
};*/
import pool from "./database/db.js";

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM Usuaris WHERE id_sessio = ?',
    [id]
  );
  return rows[0]; 
};

// --- Búsqueda de Usuario (por username) ---
export const findUserByUsername = async (username) => {
  const [rows] = await pool.query(
    'SELECT * FROM Usuaris WHERE nom_usuari = ?',
    [username]
  );
  return rows[0];
};

// --- Registro de Usuario ---
export const registerUser = async (
  username,
  email,
  password, 
  pesoActual,
  altura,
  biografia,
  nivell = 0
) => {
  // 1. Verificar si el usuario ya existe
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error("USERNAME_EXISTS");
  }

  // 2. Insertar nuevo usuario en la BD (Contraseña en texto plano)
 try {
    const result = await pool.query(
      `INSERT INTO Usuaris (nom_usuari, contrasenya, correu, pes_actual, altura, biografia, nivell)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      // 🌟 CORRECCIÓN: El array de valores debe estar aquí, completo y bien formado.
      [username, password, email, pesoActual, altura, biografia, nivell] // <--- ¡Añadir 'nivell' aquí!
    );

    // 3. Obtener el usuario recién creado (incluyendo el ID generado)
    const newUser = await findUserByUsername(username);
    
    // Eliminamos 'contrasenya' del objeto antes de devolverlo
    const { contrasenya, ...userWithoutPass } = newUser;
    return { user: userWithoutPass }; 
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('correu')) {
      throw new Error("EMAIL_EXISTS");
    }
    console.error("Error al registrar usuario en BD:", error);
    throw new Error("DB_ERROR");
  }
};

// --- Inicio de Sesión de Usuario ---
export const loginUser = async (username, password) => {
  // 1. Buscar el usuario
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS"); // Usuario no encontrado
  }

  // 2. Comparar la contraseña ingresada con la contraseña de la BD (Texto plano)
  if (user.contrasenya !== password) {
    throw new Error("INVALID_CREDENTIALS"); // Contraseña incorrecta
  }

  // 3. Devolver el usuario (sin la contraseña)
  const { contrasenya, ...userWithoutPass } = user;
  return { user: userWithoutPass };
};

// --- Actualizar Usuario ---
export const updateUser = async (id, updateData) => {
    // Usamos el ID numérico (id_sessio) como identificador en esta función
    
    let setClauses = [];
    let params = [];
    
    // Mapeo de camelCase a snake_case para la BD
    if (updateData.email !== undefined) {
        setClauses.push('correu = ?');
        params.push(updateData.email);
    }
    if (updateData.password !== undefined) {
        // Almacenar la nueva contraseña en texto plano
        setClauses.push('contrasenya = ?');
        params.push(updateData.password); 
    }
    if (updateData.pesoActual !== undefined) {
        setClauses.push('pes_actual = ?');
        params.push(updateData.pesoActual);
    }
    if (updateData.altura !== undefined) {
        setClauses.push('altura = ?');
        params.push(updateData.altura);
    }
    if (updateData.biografia !== undefined) {
        setClauses.push('biografia = ?');
        params.push(updateData.biografia);
    }
      if (updateData.nivell !== undefined) { 
      setClauses.push('nivell = ?');
      params.push(updateData.nivell);
}

    if (setClauses.length === 0) {
        // No hay datos para actualizar, devolver el usuario actual
        const currentUser = await findUserById(id);
        const { contrasenya, ...userWithoutPass } = currentUser;
        return userWithoutPass; 
    }

    const setQuery = setClauses.join(', ');
    params.push(id); // Añadir el ID del usuario al final para la cláusula WHERE

    try {
        const [result] = await pool.query(
            `UPDATE Usuaris SET ${setQuery} WHERE id_sessio = ?`,
            params
        );
        
        if (result.affectedRows === 0) {
            throw new Error("USER_NOT_FOUND");
        }

        // Devolver el usuario actualizado (sin la contraseña)
        const updatedUser = await findUserById(id);
        const { contrasenya, ...userWithoutPass } = updatedUser;
        return userWithoutPass;
        
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            throw error;
        }
        console.error("Error al actualizar usuario en BD:", error);
        throw new Error("DB_ERROR");
    }
};