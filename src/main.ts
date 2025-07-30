import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./assets/theme.css";
createApp(App)
    .use(store.original)
    .use(router)
    .mount("#app");
