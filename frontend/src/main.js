// src/main.js

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router";
// import VueGtag from "vue-gtag";

// Components
import App from "./App.vue";

// Styles
import "./styles/tailwind.css";
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(router);

// app.use(
//   VueGtag,
//   {
//     config: {
//       id: import.meta.env.VITE_GA_MEASUREMENT_ID,
//     },
//     pageTrackerScreenviewEnabled: true,
//   },
//   router
// );

app.mount("#app");
