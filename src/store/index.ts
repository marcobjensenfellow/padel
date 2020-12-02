// import { createStore } from "vuex";
// import americanoStore from "./modules/americanoStore";

// export default createStore({
//     modules: {
//         americano: americanoStore,
//     },
// });

import { createDirectStore } from "direct-vuex";
import americanoStore from "./modules/americanoStore";

const { store, rootActionContext, moduleActionContext } = createDirectStore({
    modules: {
        americanoStore,
    },
});

// Export the direct-store instead of the classic Vuex store.
export default store;

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext };

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store;
declare module "vuex" {
    interface Store<S> {
        direct: AppStore;
    }
}
