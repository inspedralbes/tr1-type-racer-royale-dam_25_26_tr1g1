/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router";
import GTag from "vue-gtag-next";

// Components
import App from "./App.vue";

// Styles
import "./styles/tailwind.css";
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(router);
app.use(GTag, {
  // Initialize GTag
  property: {
    id: import.meta.env.VITE_GA_MEASUREMENT_ID,
  },
});
app.mount("#app");
