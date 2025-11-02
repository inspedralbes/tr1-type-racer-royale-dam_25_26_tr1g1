<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div class="w-100" style="max-width: 420px">
      <v-alert
        v-if="appStore.notification.message"
        :type="appStore.notification.type"
        closable
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
