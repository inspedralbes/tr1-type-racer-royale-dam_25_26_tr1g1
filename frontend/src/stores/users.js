import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const users = ref({});

  async function fetchUser(userId) {
    if (users.value[userId]) {
      return users.value[userId];
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/users/${userId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      users.value[userId] = data;
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
