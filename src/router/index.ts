import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Americano from "../views/Americano.vue";
import TestSimulation from "../views/TestSimulation.vue";
import MatchView from "../views/MatchView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Americano",
        component: Americano,
    },
    {
        path: "/test",
        name: "TestSimulation",
        component: TestSimulation,
    },
    {
        path: "/match",
        name: "MatchView",
        component: MatchView,
    },
    // {
    //     path: "/about",
    //     name: "About",
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () =>
    //         import(/* webpackChunkName: "about" */ "../views/About.vue"),
    // },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
