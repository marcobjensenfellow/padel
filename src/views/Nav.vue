<template>
    <nav class="navbar navbar-expand-lg navbar-dark navbar-pdl">
        <a class="navbar-brand" href="#">PADEL AMERICANO</a>
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <router-link class="nav-item nav-link" to="/"
                    >Americano</router-link
                >
            </div>
        </div>
    </nav>
</template>

<script>
export default {};
</script>

<style>
.navbar-pdl {
    background-color: var(--main-gray);
}
</style>
