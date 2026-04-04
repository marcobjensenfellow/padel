<template>
    <header class="ios-nav">
        <div class="ios-nav-inner">
            <router-link to="/" class="ios-nav-title">{{ $t('app_title') }}</router-link>
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
    position: relative;
}

.ios-nav-title {
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #1C1C1E;
    text-decoration: none;
}

.lang-btn {
    position: absolute;
    right: 1.2rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--primary-color);
    background: rgba(0, 122, 255, 0.08);
    border: none;
    border-radius: 6px;
    padding: 3px 8px;
    cursor: pointer;
    transition: background 0.15s;
}

.lang-btn:hover {
    background: rgba(0, 122, 255, 0.16);
}
</style>
