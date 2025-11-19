// src/main.js

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router";
// 1. CAMBIO: Importamos la librería vue-gtag estándar
import VueGtag from "vue-gtag";

// Components
import App from "./App.vue";

// Styles
import "./styles/tailwind.css";
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(router);

// 2. CAMBIO: Implementación de VueGtag con la sintaxis de 'config'
app.use(
  VueGtag,
  {
    // El ID de Medición de GA4 se pasa en el objeto 'config'
    config: {
      id: import.meta.env.VITE_GA_MEASUREMENT_ID,
    },
    // Opcional: Esto asegura que el seguimiento de página envíe el título de la página
    pageTrackerScreenviewEnabled: true,
  },
  router
); // 3. CLAVE: Pasamos la instancia del router para el seguimiento automático

app.mount("#app");
