<template>
  <v-main>
    <v-container>
      <h1>Crear sessió</h1>

      <v-form @submit.prevent="crearSesion">
        <v-text-field
          v-model="nombreSesion"
          label="Nom de la sessió"
          placeholder="Escriu un nom per la sessió"
        ></v-text-field>

        <v-select
          v-model="grupoSeleccionado"
          :items="gruposMusculares"
          label="Esculleix que vols treballar"
          placeholder="Selecciona una àrea per treballar"
        ></v-select>

        <h1>Paràmetres</h1>

        <v-text-field
          v-model.number="limitParticipants"
          label="Límit de participants"
          type="number"
          placeholder="Ex: 4"
        ></v-text-field>

        <v-switch
          v-model="esPrivada"
          label="Sessió privada"
          color="primary"
        ></v-switch>
        <v-btn type="submit" color="primary" class="mt-4"> Crear </v-btn>
      </v-form>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue";

const nombreSesion = ref("");
const grupoSeleccionado = ref(null);

const limitParticipants = ref(1);
const esPrivada = ref(false);

const gruposMusculares = ref(["Esquena", "Cames", "Pit", "Braç"]);

function crearSesion() {
  const limit = Number(limitParticipants.value);

  if (
    !nombreSesion.value ||
    !grupoSeleccionado.value ||
    limit < 1 ||
    !Number.isInteger(limit)
  ) {
    alert(
      "Revisa els camps. El límit de participants ha de ser com a mínim 1 i no pot tenir decimals."
    );
    return;
  }

  console.log("--- Creant sessió ---");
  console.log("Nom:", nombreSesion.value);
  console.log("Àrea:", grupoSeleccionado.value);
  console.log("Límit:", limit);
  console.log("Privada:", esPrivada.value);

  const tipusPrivacitat = esPrivada.value ? "privada" : "pública";
  alert(
    `Sessió "${nombreSesion.value}" creada amb èxit! (Límit: ${limit}, ${tipusPrivacitat})`
  );

  nombreSesion.value = "";
  grupoSeleccionado.value = null;
  limitParticipants.value = 1;
  esPrivada.value = false;
}
</script>
