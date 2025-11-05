/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router";

// Components
import App from "./App.vue";

// Styles
import "./styles/tailwind.css";
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(router).mount("#app");
