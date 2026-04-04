import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Americano from "../views/Americano.vue";
import TestSimulation from "../views/TestSimulation.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/spil",
        name: "Americano",
        component: Americano,
    },
    {
        path: "/test",
        name: "TestSimulation",
        component: TestSimulation,
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

export default router;
