<template>
  <v-card>
    <v-card-title>Crear Nova Sessió</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-select
          v-model="options.type"
          :items="exerciseTypes"
          label="Tipus d'exercici"
          required
        ></v-select>

        <v-text-field
          v-model.number="options.time"
          label="Temps (minuts)"
          type="number"
          required
        ></v-text-field>

        <v-slider
          v-model.number="options.maxUsers"
          label="Mida de la sala"
          thumb-label
          :min="2"
          :max="16"
          :step="1"
        ></v-slider>

        <v-switch
          v-model="options.isPublic"
          :label="options.isPublic ? 'Pública' : 'Privada'"
        ></v-switch>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">
        Cancel·lar
      </v-btn>
      <v-btn
        color="blue-darken-1"
        variant="tonal"
        @click="submit"
        :disabled="!valid"
      >
        Crear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, reactive } from "vue";

const emit = defineEmits(['submit', 'close']);

const valid = ref(false);
const form = ref(null);

const options = reactive({
  type: "Full Body",
  time: 30,
  isPublic: true,
  maxUsers: 8,
});

const exerciseTypes = ["Full Body", "Legs", "Upper Body", "Cardio"];

const submit = () => {
  if (form.value.validate()) {
    emit('submit', { ...options });
  }
};
</script>