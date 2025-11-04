<template>
  <v-container>
    <v-list lines="two" class="bg-transparent">
      <v-list-item
        v-for="session in sessions"
        :key="session.id"
        class="mb-4 pa-4"
        @click="handleSessionClick(session)"
        :disabled="
          session.users.length >= session.maxUsers ||
          session.state.status !== 'WAITING'
        "
        elevation="4"
        rounded="lg"
        style="
          background-color: rgba(var(--v-theme-surface), 0.8);
          backdrop-filter: blur(4px);
        "
      >
        <div class="d-flex flex-wrap align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon size="32">mdi-dumbbell</v-icon>
            </v-avatar>
            <div>
              <v-list-item-title class="text-h5 font-weight-bold">{{
                session.type
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-body-1"
                >ID: {{ session.id.substring(0, 8) }}</v-list-item-subtitle
              >
            </div>
          </div>

          <div class="d-flex align-center text-h6 mt-4 mt-md-0">
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-account-group" class="mr-2" />
              <span
                >{{ session.users.length }} / {{ session.maxUsers }}</span
              >
            </div>
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              <v-icon
                :icon="!session.password ? 'mdi-earth' : 'mdi-lock'"
                class="mr-2"
              />
              <span v-if="smAndUp">{{ !session.password ? "Public" : "Private" }}</span>
            </div>
            <v-btn
              color="primary"
              variant="elevated"
              :size="smAndUp ? 'large' : 'default'"
              :disabled="
                session.users.length >= session.maxUsers ||
                session.state.status !== 'WAITING'
              "
              @click.stop="handleSessionClick(session)"
            >
              <v-icon left :class="{'mr-2': smAndUp}">mdi-play-circle-outline</v-icon>
              <span v-if="smAndUp">Join</span>
            </v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>

    <v-dialog v-model="showPasswordDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Enter Password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="passwordInput"
            label="Password"
            type="password"
            outlined
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="showPasswordDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="confirmJoinSession">Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { useWebSocketStore } from "@/stores/websocket";
import { useAppStore } from "@/stores/app";

const { smAndUp } = useDisplay();
const appStore = useAppStore();
const websocketStore = useWebSocketStore();
const userId = appStore.user.id;

const sessions = computed(() => websocketStore.sessions);

const showPasswordDialog = ref(false);
const passwordInput = ref('');
const selectedSession = ref(null);

const handleSessionClick = (session) => {
  if (session.password) {
    selectedSession.value = session;
    showPasswordDialog.value = true;
  } else {
    joinSession(session.id, '');
  }
};

const confirmJoinSession = () => {
  if (selectedSession.value) {
    joinSession(selectedSession.value.id, passwordInput.value);
    showPasswordDialog.value = false;
    passwordInput.value = '';
  }
};

const joinSession = (sessionId, password) => {
  websocketStore.sendMessage({
    type: "JOIN_SESSION",
    payload: { sessionId, password },
  });
};
</script>