<script setup>
import { ref, onMounted } from "vue";

const userData = ref({ username: "", email: "", date_created: "" });

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:5000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No se pudo cargar el perfil");
    userData.value = await res.json();
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <h2>{{ userData.username }}</h2>
  <p>{{ userData.email }}</p>
  <p>{{ userData.date_created }}</p>
</template>
