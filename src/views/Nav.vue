<template>
    <header class="ios-nav">
        <div class="ios-nav-inner">
            <span class="ios-nav-title">Padel</span>
        </div>
    </header>
</template>

<script>
export default {};
</script>

<style scoped>
.ios-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(242, 242, 247, 0.85);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid rgba(60,60,67,0.12);
}

.ios-nav-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 0.6rem 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ios-nav-title {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #1C1C1E;
}
</style>
