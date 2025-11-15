import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const users = ref({});

  async function fetchUser(userId, force = false) {
    if (users.value[userId] && !force) {
      console.log(`[usersStore] Returning cached user ${userId}. Nivel:`, users.value[userId].nivel);
      return users.value[userId];
    }

    try {
      console.log(`[usersStore] Fetching user ${userId} from API.`);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/users/${userId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log(`[usersStore] API response for user ${userId}:`, data);
      users.value[userId] = data;
      console.log(`[usersStore] User ${userId} stored. Nivel:`, users.value[userId].nivel);
      return data;
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      return null;
    }
  }

  function getUser(userId) {
    return users.value[userId] || null;
  }

  return { users, fetchUser, getUser };
});
