<template>
  <NavBar />

  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <!-- MODO VISTA -->
          <v-card v-if="!isEditing" class="text-center">
            <v-card-text>
              <v-avatar size="120" class="mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Avatar"
                />
              </v-avatar>
              <h2 class="text-h5 font-weight-bold">{{ nombreUsuario }}</h2>
              <p class="text-subtitle-1 text-grey-darken-1">
                PUNTS: {{ puntos }}
              </p>
              <p>Username: {{ userData.username }}</p>
              <p>Email: {{ userData.email }}</p>
              <p>Fecha creación: {{ userData.date_created }}</p>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col>
                  <p class="text-subtitle-2 text-grey">PES ACTUAL</p>
                  <p class="text-h6">{{ pesoActual }} kg</p>
                </v-col>
                <v-col>
                  <p class="text-subtitle-2 text-grey">ALTURA</p>
                  <p class="text-h6">{{ altura }} cm</p>
                </v-col>
                <v-col>
                  <p class="text-subtitle-2 text-grey">PES OBJECTIU</p>
                  <p class="text-h6">{{ pesoMeta }} kg</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex flex-column ga-2 pa-4">
              <v-btn
                @click="iniciarEdicion"
                color="primary"
                block
                variant="flat"
                >Editar Perfil</v-btn
              >
              <v-btn @click="verHistorial" block variant="outlined"
                >Historial d'Entrenaments</v-btn
              >
              <v-btn @click="handleLogout" color="red" block variant="outlined"
                >Tancar Sessió</v-btn
              >
            </v-card-actions>
          </v-card>

          <!-- MODO EDICIÓN -->
          <v-card v-else>
            <v-card-title class="text-h5">Editar Perfil</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="guardarCambios">
                <v-text-field
                  v-model="editedNombre"
                  label="Nom"
                  outlined
                  dense
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model.number="editedPeso"
                  label="Pes (kg)"
                  type="number"
                  outlined
                  dense
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model.number="editedAltura"
                  label="Altura (cm)"
                  type="number"
                  outlined
                  dense
                ></v-text-field>
                <v-card-actions class="pa-0 mt-4">
                  <v-spacer></v-spacer>
                  <v-btn @click="cancelarEdicion" variant="text"
                    >Cancelar</v-btn
                  >
                  <v-btn type="submit" color="primary" variant="flat"
                    >Guardar</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-card-text>
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

// Router
const router = useRouter();

// Estado de edición
const isEditing = ref(false);

// Datos de usuario desde API
const userData = ref({ username: "", email: "", date_created: "" });

// Datos de perfil local
const nombreUsuario = ref("Nom Usuari");
const puntos = ref(1250);
const pesoActual = ref(70);
const pesoMeta = ref(65);
const altura = ref(180);

// Refs temporales para edición
const editedNombre = ref("");
const editedPeso = ref(0);
const editedAltura = ref(0);

// Funciones

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

const iniciarEdicion = () => {
  editedNombre.value = nombreUsuario.value;
  editedPeso.value = pesoActual.value;
  editedAltura.value = altura.value;
  isEditing.value = true;
};

const guardarCambios = () => {
  nombreUsuario.value = editedNombre.value;
  pesoActual.value = editedPeso.value;
  altura.value = editedAltura.value;
  isEditing.value = false;
  alert("Perfil actualitzat correctament!");
};

const cancelarEdicion = () => {
  isEditing.value = false;
};

const verHistorial = () => {
  alert("Encara no toquem res");
};

const handleLogout = () => {
  localStorage.removeItem("token"); // corregido para coincidir con onMounted
  router.push("/login");
};
</script>

<style scoped></style>
