import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import { analytics } from "./firebase";

createApp(App)
    .use(store.original)
    .use(router)
    .mount("#app");
