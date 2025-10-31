<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div v-if="appStore.isAuthenticated">
      <!-- Puedes poner aquí un mensaje o loader -->
    </div>

    <div v-else class="w-100" style="max-width: 420px">
      <v-alert
        v-if="appStore.notification.message"
        :type="appStore.notification.type"
        closable
        border="start"
        elevation="2"
        class="mb-4"
      >
        {{ appStore.notification.message }}
      </v-alert>

      <v-card elevation="8" rounded="xl" class="overflow-hidden">
        <v-window v-model="tab" class="pa-6">
          <v-window-item value="login">
            <FormLogin />
          </v-window-item>

          <v-window-item value="register">
            <FormRegister />
          </v-window-item>
        </v-window>

        <v-card-actions class="justify-center py-4">
          <v-btn
            v-if="!appStore.isAuthenticated"
            variant="text"
            color="grey-darken-1"
            @click="tab = tab === 'login' ? 'register' : 'login'"
          >
            {{
              tab === "login"
                ? "¿No tens compte? Registrat"
                : "¿Ja tens compte? Inicia sessió"
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";

import FormLogin from "@/components/FormLogin.vue";
import FormRegister from "@/components/FormRegister.vue";

const router = useRouter();
const websocketStore = useWebSocketStore();
const appStore = useAppStore();

const tab = ref("login");

onMounted(() => {
  if (appStore.isAuthenticated && !websocketStore.isConnected) {
    websocketStore.connect("ws://localhost:5000");
  }
});

const logout = () => {
  appStore.setLoggedOut();
};
</script>
