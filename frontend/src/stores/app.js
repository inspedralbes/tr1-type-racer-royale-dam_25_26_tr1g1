import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    username: "",
    password: "",
  }),
  actions: {
    login(username, password) {
      this.username = username;
      this.password = password;
    },
    register(username, email, password) {
      this.username = username;
      this.email = email;
      this.password = password;
    },
  },
});
