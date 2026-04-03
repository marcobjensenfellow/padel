import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./assets/theme.css";
import { t, i18nState, setLocale } from "./i18n";

const app = createApp(App);

app.config.globalProperties.$t = t;
app.config.globalProperties.$i18n = i18nState;
app.config.globalProperties.$setLocale = setLocale;

app.use(store.original).use(router).mount("#app");
