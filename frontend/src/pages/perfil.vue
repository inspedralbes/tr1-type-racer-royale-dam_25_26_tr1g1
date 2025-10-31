<template>
  <NavBar />

  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="text-center">
            <v-card-text>
              <v-avatar size="120" class="mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Avatar"
                />
              </v-avatar>
              <h2 class="text-h5 font-weight-bold">{{ userData.username }}</h2>
              <p class="text-subtitle-1 text-grey-darken-1">
                PUNTS: {{ userData.puntos }}
              </p>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ userData.email }}</v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    new Date(userData.date_created).toLocaleDateString()
                  }}</v-list-item-title>
                  <v-list-item-subtitle>Membre des de</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col>
                  <p class="text-subtitle-2 text-grey">PES ACTUAL</p>
                  <p class="text-h6">{{ userData.pesoActual || "-" }} kg</p>
                </v-col>
                <v-col>
                  <p class="text-subtitle-2 text-grey">ALTURA</p>
                  <p class="text-h6">{{ userData.altura || "-" }} cm</p>
                </v-col>
                <v-col>
                  <p class="text-subtitle-2 text-grey">PES OBJECTIU</p>
                  <p class="text-h6">{{ userData.pesoMeta || "-" }} kg</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex flex-column ga-2 pa-4">
              <v-btn @click="handleLogout" color="red" block variant="outlined"
                >Tancar Sessió</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();
const userData = ref({
  username: "",
  email: "",
  date_created: "",
  puntos: 0,
  pesoActual: null,
  altura: null,
  pesoMeta: null,
});

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/"); // Redirect to login if no token
      return;
    }

    const res = await fetch("http://localhost:5000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No se pudo cargar el perfil");

    const data = await res.json();
    userData.value = { ...userData.value, ...data };
  } catch (err) {
    console.error(err);
    // Maybe show an error message to the user
  }
});

const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/");
};
</script>

<style scoped></style>
