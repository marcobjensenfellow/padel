<template>
    <div class="home-page">

        <!-- Hero -->
        <section class="hero">
            <div class="hero-court">
                <div class="court-line court-line--v"></div>
                <div class="court-line court-line--h"></div>
                <div class="court-service"></div>
            </div>
            <div class="hero-content">
                <p class="hero-mode-badge">Americano &amp; Mexicano</p>
                <h1 class="hero-title">{{ $t('home_headline') }}</h1>
                <p class="hero-tagline">{{ $t('home_tagline') }}</p>
                <div class="hero-ctas">
                    <router-link to="/spil" class="hero-btn-primary">
                        {{ $t('home_cta') }} →
                    </router-link>
                    <router-link
                        v-if="hasSavedGame"
                        to="/spil"
                        class="hero-btn-secondary"
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

        <!-- Tournament History -->
        <section v-if="history.length > 0" class="history-section">
            <p class="ios-section-header">{{ $t('history_title') }}</p>
            <div class="ios-section history-list">
                <div
                    v-for="entry in history"
                    :key="entry.id"
                    class="history-row"
                >
                    <div class="history-main">
                        <div class="history-name-row">
                            <span class="history-name">{{ entry.name }}</span>
                            <span class="history-badge" :class="entry.completed ? 'badge--done' : 'badge--live'">
                                {{ entry.completed ? $t('history_completed') : $t('history_ongoing') }}
                            </span>
                        </div>
                        <div class="history-meta">
                            <span class="history-format">{{ entry.format }}</span>
                            <span class="history-dot">·</span>
                            <span>{{ $t('history_players', { n: entry.numPlayers }) }}</span>
                            <span class="history-dot">·</span>
                            <span>{{ $t('history_rounds', { n: entry.roundsPlayed, total: entry.totalRounds }) }}</span>
                            <span class="history-dot">·</span>
                            <span class="history-date">{{ formatDate(entry.savedAt) }}</span>
                        </div>
                        <div v-if="entry.top3.length > 0" class="history-podium">
                            <span
                                v-for="(p, i) in entry.top3"
                                :key="i"
                                class="podium-chip"
                                :class="`podium-chip--${i}`"
                            >
                                {{ podiumIcon(i) }} {{ p.name }}
                                <span class="podium-score">{{ p.score }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div v-else class="history-empty">
            <p>{{ $t('history_empty') }}</p>
        </div>

        <!-- Bottom CTA -->
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
import { getHistory, TournamentSummary } from "@/services/tournamentHistoryService";

export default defineComponent({
    name: "Home",
    data() {
        return {
            history: [] as TournamentSummary[],
        };
    },
    mounted() {
        this.history = getHistory();
    },
    computed: {
        hasSavedGame(): boolean {
            return store.getters.americanoStore.getIsGamePrepared;
        },
    },
    methods: {
        formatDate(iso: string): string {
            try {
                return new Date(iso).toLocaleDateString(
                    this.$i18n.locale === "da" ? "da-DK" : "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                );
            } catch {
                return iso.slice(0, 10);
            }
        },
        podiumIcon(index: number): string {
            return ["🥇", "🥈", "🥉"][index] ?? "";
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
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* Decorative court lines */
.hero-court { position: absolute; inset: 0; pointer-events: none; }
.court-line { position: absolute; background: rgba(255,255,255,0.1); }
.court-line--v { width: 2px; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); }
.court-line--h { height: 2px; left: 0; right: 0; top: 50%; transform: translateY(-50%); }
.court-service {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%,-50%);
    width: 52px; height: 52px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.14);
}

.hero-content { position: relative; z-index: 1; padding: 2.5rem 1.5rem; }

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
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #fff;
    margin: 0 0 0.55rem;
    line-height: 1;
}

.hero-tagline {
    color: rgba(255,255,255,0.82);
    font-size: 0.95rem;
    max-width: 300px;
    margin: 0 auto 1.6rem;
    line-height: 1.4;
}

.hero-ctas { display: flex; flex-direction: column; gap: 0.55rem; align-items: center; }

.hero-btn-primary {
    font-size: 1.05rem;
    padding: 0.85rem 2rem;
    border-radius: var(--radius-lg);
    background: #fff;
    color: #C2784A;
    font-weight: 700;
    text-decoration: none;
    display: inline-block;
    font-family: inherit;
    transition: opacity 0.15s;
}
.hero-btn-primary:hover { opacity: 0.88; }

.hero-btn-secondary {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.88);
    text-decoration: none;
    display: inline-block;
    padding: 0.35rem 0.6rem;
}

/* ─── Features ─── */
.features { display: flex; flex-direction: column; gap: 0.6rem; }

.feat-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 0.95rem 1.1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
}

.feat-icon { font-size: 1.5rem; line-height: 1; flex-shrink: 0; margin-top: 0.1rem; }
.feat-card h3 { font-size: 0.92rem; font-weight: 700; margin: 0 0 0.18rem; }
.feat-card p  { font-size: 0.82rem; color: var(--label-secondary); margin: 0; line-height: 1.4; }

@media (min-width: 540px) {
    .features { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
}

/* ─── History ─── */
.history-section { margin-top: 2rem; }

.history-list { padding: 0; }

.history-row {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid var(--separator-opaque);
}
.history-row:last-child { border-bottom: none; }

.history-name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.2rem;
}

.history-name {
    font-weight: 700;
    font-size: 0.95rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    border-radius: 999px;
    padding: 0.18rem 0.55rem;
    flex-shrink: 0;
}
.badge--done { background: rgba(52,199,89,0.12); color: var(--secondary-color); }
.badge--live { background: rgba(0,122,255,0.1); color: var(--primary-color); }

.history-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    font-size: 0.78rem;
    color: var(--label-secondary);
    margin-bottom: 0.45rem;
    align-items: center;
}
.history-dot { color: var(--separator-opaque); }
.history-format { font-weight: 600; }
.history-date { color: var(--label-tertiary, var(--label-secondary)); }

.history-podium {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.podium-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
    font-size: 0.78rem;
    font-weight: 600;
    background: var(--bg);
    border-radius: 999px;
    padding: 0.18rem 0.55rem;
}
.podium-score {
    font-weight: 800;
    font-size: 0.72rem;
    color: var(--label-secondary);
}

/* ─── Empty / Footer ─── */
.history-empty {
    margin-top: 2rem;
    text-align: center;
    color: var(--label-secondary);
    font-size: 0.88rem;
}

.home-footer { text-align: center; margin-top: 2rem; }
.home-footer-btn {
    font-size: 1rem;
    padding: 0.85rem 2.5rem;
    border-radius: var(--radius-lg);
    text-decoration: none;
    display: inline-block;
}
</style>
