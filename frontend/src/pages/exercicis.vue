<template>
  <NavBar />
  <v-main>
    <v-container>
      <h1 class="text-h4 font-weight-bold text-center mb-8">
        Grups Musculars
      </h1>
      <v-row>
        <v-col
          v-for="grup in grupsMusculars"
          :key="grup.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="mx-auto"
            max-width="400"
            hover
            @click="veureExercicis(grup.id)"
          >
            <v-img :src="grup.imatge" height="200px" cover></v-img>

            <v-card-title class="font-weight-bold">
              {{ grup.nom }}
            </v-card-title>

            <v-card-subtitle>
              {{ grup.descripcio }}
            </v-card-subtitle>

            <v-card-actions>
              <v-btn color="primary" variant="text"> Explorar </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "@/components/NavBar.vue";

const router = useRouter();

const grupsMusculars = ref([
  {
    id: "pit",
    nom: "Pit",
    descripcio: "Exercicis per enfortir el pectoral.",
    imatge: "https://source.unsplash.com/random/400x300/?chest,gym",
  },
  {
    id: "esquena",
    nom: "Esquena",
    descripcio: "Desenvolupa una esquena forta i definida.",
    imatge: "https://source.unsplash.com/random/400x300/?back,gym",
  },
  {
    id: "cames",
    nom: "Cames",
    descripcio: "Tonifica i potencia les teves cames.",
    imatge: "https://source.unsplash.com/random/400x300/?legs,gym",
  },
]);

const veureExercicis = (idGrup) => {
  // De momento, solo mostramos un alert. En el futuro, redirigirá a la página de ejercicios de ese grupo.
  alert(`Navegant als exercicis de: ${idGrup}`);
  // router.push(`/exercicis/${idGrup}`);
};
</script>