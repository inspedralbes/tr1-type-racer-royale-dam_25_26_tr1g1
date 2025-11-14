import User from "./models/user.model.js";

export const findUserById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

export const findUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user;
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
  if (await findUserByUsername(username)) {
    throw new Error("USERNAME_EXISTS");
  }

  const newUser = await User.create({
    username,
    email,
    password,
    pesoActual,
    altura,
    biografia,
    foto_perfil:
      foto_perfil || `https://robohash.org/${username}.png?bgset=bg1`,
  });

  return { user: newUser };
};

export const loginUser = async (username, password) => {
  const user = await findUserByUsername(username);

  if (!user || !(await user.validPassword(password))) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return { user };
};

export const updateUser = async (id, updateData) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (updateData.foto_perfil === "") {
    delete updateData.foto_perfil;
  }

  const updatedUser = await user.update(updateData);
  return updatedUser;
};
