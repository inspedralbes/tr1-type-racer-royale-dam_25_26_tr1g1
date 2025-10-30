<template>
  <FormLogin></FormLogin>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";
import FormLogin from "@/components/FormLogin.vue";

const websocketStore = useWebSocketStore();
const appStore = useAppStore();

const connect = () => {
  websocketStore.connect("ws://localhost:5000");
};

onMounted(() => {
  connect();
});

const sendMessage = () => {
  const message = {
    type: "LOGIN_USER",
    payload: { user: appStore.username, password: appStore.password },
  };
  websocketStore.sendMessage(message);
};

watch(
  () => appStore.username,
  (newVal, oldVal) => {
    if (newVal) {
      sendMessage();
    }
  }
);
</script>
