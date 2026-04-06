<template>
    <header class="sport-nav">
        <div class="sport-nav-inner">
            <router-link to="/" class="sport-nav-logo">
                <span class="logo-icon">🎾</span>
                <span class="logo-text">PADEL</span>
            </router-link>
            <button
                class="lang-btn"
                @click="toggleLocale"
                :aria-label="$i18n.locale === 'en' ? 'Skift til dansk' : 'Switch to English'"
            >
                {{ $i18n.locale === 'en' ? 'DA' : 'EN' }}
            </button>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Locale } from "@/i18n";

export default defineComponent({
    methods: {
        toggleLocale() {
            const next: Locale = this.$i18n.locale === "en" ? "da" : "en";
            this.$setLocale(next);
        },
    },
});
</script>

<style scoped>
.sport-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(15, 23, 42, 0.94);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sport-nav-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 0.65rem 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.sport-nav-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
}

.logo-icon {
    font-size: 1rem;
    line-height: 1;
}

.logo-text {
    font-size: 0.92rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    color: #FFFFFF;
    text-transform: uppercase;
}

.lang-btn {
    position: absolute;
    right: 1.2rem;
    font-size: 0.70rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.70);
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px;
    padding: 4px 9px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    font-family: inherit;
}

.lang-btn:hover {
    background: rgba(255,255,255,0.18);
    color: #fff;
}
</style>
