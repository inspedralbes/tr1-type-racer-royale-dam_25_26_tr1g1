<template>
  <v-container>
    <div v-if="appStore.isAuthenticated"></div>
    <div v-else>
      <v-alert
        v-if="appStore.notification.message"
        :type="appStore.notification.type"
        closable
        class="mb-4"
      >
        {{ appStore.notification.message }}
      </v-alert>

      <v-card>
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="login">Login</v-tab>
          <v-tab value="register">Register</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="login">
              <FormLogin />
            </v-window-item>
            <v-window-item value="register">
              <FormRegister />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
  if (!websocketStore.isConnected) {
    websocketStore.connect("ws://localhost:5000");
  }

  if (appStore.isAuthenticated) {
    router.push("/sessions");
  }
});

watch(
  () => appStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      router.push("/sessions");
    } else {
      router.push("/");
    }
  }
);

const logout = () => {
  appStore.setLoggedOut();
};
</script>
