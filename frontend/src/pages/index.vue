<template>
  <v-container fluid class="fill-height pa-0" style="background: linear-gradient(to right, #1e1e1e, #121212);">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="text-center mb-8">
          <img src="@/assets/logo.png" alt="Logo" height="80" />
        </div>
        <v-alert
          v-if="appStore.notification.message"
          :type="appStore.notification.type"
          closable
          elevation="2"
          class="mb-4"
        >
          {{ appStore.notification.message }}
        </v-alert>

        <v-card elevation="12" rounded="xl" class="overflow-hidden" style="backdrop-filter: blur(10px); background-color: rgba(30, 30, 30, 0.8);">
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
              color="white"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/app";

import FormLogin from "@/components/Forms/FormLogin.vue";
import FormRegister from "@/components/Forms/FormRegister.vue";

const appStore = useAppStore();

onMounted(() => {
  appStore.clearUser();
});

const tab = ref("login");
</script>
