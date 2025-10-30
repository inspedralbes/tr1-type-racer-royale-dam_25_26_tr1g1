<template>
  <v-container>
    <h2 class="py-4">Sessions Actives</h2>
    <v-row>
      <v-col
        v-for="session in appStore.sessions"
        :key="session.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-title>{{ session.workout }}</v-card-title>
          <v-card-subtitle>ID: {{ session.id }}</v-card-subtitle>
          <v-card-text>
            <div><strong>Usuaris:</strong> {{ session.users.join(", ") }}</div>
            <div><strong>Estat:</strong> {{ session.state.status }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Unir-se</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
</script>
