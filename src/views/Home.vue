<template>
    <div class="home-page">

        <!-- Hero -->
        <section class="hero">
            <div class="hero-court">
                <div class="court-lines">
                    <div class="court-line court-line--v"></div>
                    <div class="court-line court-line--h"></div>
                    <div class="court-service"></div>
                </div>
            </div>
            <div class="hero-content">
                <p class="hero-mode-badge">Americano &amp; Mexicano</p>
                <h1 class="hero-title">{{ $t('home_headline') }}</h1>
                <p class="hero-tagline">{{ $t('home_tagline') }}</p>

                <div class="hero-ctas">
                    <router-link to="/spil" class="btn-pdl hero-btn-primary">
                        {{ $t('home_cta') }} →
                    </router-link>
                    <router-link
                        v-if="hasSavedGame"
                        to="/spil"
                        class="btn-pdl-ghost hero-btn-secondary"
                    >
                        {{ $t('home_resume') }}
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="features">
            <div class="feat-card">
                <span class="feat-icon">🎯</span>
                <div>
                    <h3>{{ $t('home_feat1_title') }}</h3>
                    <p>{{ $t('home_feat1_body') }}</p>
                </div>
            </div>
            <div class="feat-card">
                <span class="feat-icon">🌱</span>
                <div>
                    <h3>{{ $t('home_feat2_title') }}</h3>
                    <p>{{ $t('home_feat2_body') }}</p>
                </div>
            </div>
            <div class="feat-card">
                <span class="feat-icon">↔️</span>
                <div>
                    <h3>{{ $t('home_feat3_title') }}</h3>
                    <p>{{ $t('home_feat3_body') }}</p>
                </div>
            </div>
            <div class="feat-card">
                <span class="feat-icon">💾</span>
                <div>
                    <h3>{{ $t('home_feat4_title') }}</h3>
                    <p>{{ $t('home_feat4_body') }}</p>
                </div>
            </div>
        </section>

        <!-- Footer nudge -->
        <div class="home-footer">
            <router-link to="/spil" class="btn-pdl home-footer-btn">
                {{ $t('home_cta') }} →
            </router-link>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";

export default defineComponent({
    name: "Home",
    computed: {
        hasSavedGame(): boolean {
            return store.getters.americanoStore.getIsGamePrepared;
        },
    },
});
</script>

<style scoped>
.home-page {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 1rem 4rem;
}

/* ─── Hero ─── */
.hero {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    margin: 1.2rem 0 1.5rem;
    background: #C2784A;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* Decorative court lines */
.hero-court {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.court-lines {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.court-line {
    position: absolute;
    background: rgba(255,255,255,0.12);
}

.court-line--v {
    width: 2px;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.court-line--h {
    height: 2px;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.court-service {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.18);
}

/* Hero text */
.hero-content {
    position: relative;
    z-index: 1;
    padding: 2.5rem 1.5rem;
}

.hero-mode-badge {
    display: inline-block;
    background: rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.9);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 999px;
    padding: 0.3rem 0.8rem;
    margin: 0 0 0.75rem;
}

.hero-title {
    font-size: 3.2rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #fff;
    margin: 0 0 0.6rem;
    line-height: 1;
}

.hero-tagline {
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    max-width: 320px;
    margin: 0 auto 1.6rem;
    line-height: 1.4;
}

.hero-ctas {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: center;
}

.hero-btn-primary {
    font-size: 1.05rem;
    padding: 0.85rem 2rem;
    border-radius: var(--radius-lg);
    background: #fff !important;
    color: #C2784A !important;
    font-weight: 700;
    text-decoration: none;
    display: inline-block;
    transition: opacity 0.15s;
}

.hero-btn-primary:hover { opacity: 0.88; }

.hero-btn-secondary {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.9) !important;
    text-decoration: none;
    display: inline-block;
    padding: 0.4rem 0.8rem;
}

/* ─── Features ─── */
.features {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.feat-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1rem 1.1rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.feat-icon {
    font-size: 1.6rem;
    line-height: 1;
    flex-shrink: 0;
    margin-top: 0.1rem;
}

.feat-card h3 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 0.2rem;
    color: var(--label-primary);
}

.feat-card p {
    font-size: 0.85rem;
    color: var(--label-secondary);
    margin: 0;
    line-height: 1.4;
}

/* ─── Footer CTA ─── */
.home-footer {
    text-align: center;
    margin-top: 2rem;
}

.home-footer-btn {
    font-size: 1rem;
    padding: 0.85rem 2.5rem;
    border-radius: var(--radius-lg);
    text-decoration: none;
    display: inline-block;
}

@media (min-width: 540px) {
    .features {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }
}
</style>
