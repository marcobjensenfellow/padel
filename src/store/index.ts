import { createStore } from "vuex";
import americanoStore from "./modules/americanoStore";

export default createStore({
    modules: {
        americano: americanoStore,
    },
});
