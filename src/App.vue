<template>
    <Nav></Nav>
    <router-view />
</template>

<script>
import store from "./store/index";
import Nav from "./views/Nav.vue";

export default {
    beforeCreate() {
        store.commit.americanoStore.LOAD_STATE();
    },
    components: {
        Nav,
    },
};
</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--dark-color);
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: var(--dark-color);
}

#nav a.router-link-exact-active {
    color: var(--accent-color);
}

@media (max-width: 623px) {
    html {
        font-size: 10px;
    }
}
</style>
