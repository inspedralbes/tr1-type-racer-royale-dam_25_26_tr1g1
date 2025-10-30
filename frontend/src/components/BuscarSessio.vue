<template>
  <v-main>
    <v-container>
      <h1>Buscar sessió</h1>

      <v-form @submit.prevent="unirseSesion">
        <v-text-field
          v-model="codigoSesion"
          label="Codi de la sessió"
          placeholder="Escriu el codi per unir-te"
        ></v-text-field>

        <v-btn type="submit" color="primary" class="mt-4"> Unir-se </v-btn>
      </v-form>
    </v-container>
  </v-main>
</template>

<script setup>
const codigoSesion = ref("");

function unirseSesion() {
  if (!codigoSesion.value) {
    alert("Has d'introduir un codi de sessió.");
    return;
  }

  console.log("--- Unint-se a la sessió ---");
  console.log("Codi:", codigoSesion.value);
  alert(`Intentant unir-se a la sessió amb el codi: "${codigoSesion.value}"`);
}
</script>
