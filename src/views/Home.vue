<template>
    <div class="home-page">

        <!-- ─── Hero ──────────────────────────────────────── -->
        <section class="hero">
            <div class="hero-bg-lines" aria-hidden="true">
                <div class="bg-line bg-line--v"></div>
                <div class="bg-line bg-line--h"></div>
                <div class="bg-circle"></div>
            </div>
            <div class="hero-body">
                <span class="hero-badge">AMERICANO &amp; MEXICANO</span>
                <h1 class="hero-headline">{{ $t('home_hero_headline') }}</h1>
                <p class="hero-sub">{{ $t('home_headline_sub') }}</p>

                <div class="hero-ctas">
                    <button type="button" class="btn-hero-primary" @click="startNew">
                        {{ $t('home_start_new') }}
                    </button>
                    <button
                        v-if="hasSavedGame"
                        type="button"
                        class="btn-hero-secondary"
                        @click="resumeGame"
                    >
                        {{ $t('home_resume') }} →
                    </button>
                </div>

                <p v-if="lastFormat" class="hero-format-hint">
                    {{ $t('home_last_format', { format: lastFormat }) }}
                </p>
            </div>
        </section>

        <!-- ─── USP strip ─────────────────────────────────── -->
        <div class="usp-card">
            <div class="usp-grid">
                <div class="usp-item">
                    <span class="usp-icon">🌱</span>
                    <span class="usp-label">{{ $t('home_feat1_title') }}</span>
                </div>
                <div class="usp-item">
                    <span class="usp-icon">↔️</span>
                    <span class="usp-label">{{ $t('home_feat2_title') }}</span>
                </div>
                <div class="usp-item">
                    <span class="usp-icon">💾</span>
                    <span class="usp-label">{{ $t('home_feat3_title') }}</span>
                </div>
                <div class="usp-item">
                    <span class="usp-icon">🔄</span>
                    <span class="usp-label">{{ $t('home_feat4_title') }}</span>
                </div>
            </div>
        </div>

        <!-- ─── Format picker ─────────────────────────────── -->
        <section class="section">
            <h2 class="section-title">{{ $t('home_format_section') }}</h2>
            <div class="format-grid">

                <!-- Americano -->
                <button
                    type="button"
                    class="format-card"
                    :class="{ 'format-card--selected': selectedFormat === 'Americano' }"
                    @click="selectFormat('Americano')"
                >
                    <div class="format-card-top">
                        <div class="format-icon">🎾</div>
                        <div class="format-badges">
                            <span
                                v-if="selectedFormat === 'Americano'"
                                class="format-selected-badge"
                            >{{ $t('home_format_selected') }}</span>
                        </div>
                    </div>
                    <h3 class="format-name">Americano</h3>
                    <p class="format-desc">{{ $t('home_americano_desc_long') }}</p>
                    <span class="format-how-link">{{ $t('home_format_how') }} ›</span>
                </button>

                <!-- Mexicano -->
                <button
                    type="button"
                    class="format-card format-card--mexicano"
                    :class="{ 'format-card--selected': selectedFormat === 'Mexicano' }"
                    @click="selectFormat('Mexicano')"
                >
                    <div class="format-card-top">
                        <div class="format-icon">📈</div>
                        <div class="format-badges">
                            <span class="format-popular-badge">{{ $t('home_format_most_popular') }}</span>
                            <span
                                v-if="selectedFormat === 'Mexicano'"
                                class="format-selected-badge"
                            >{{ $t('home_format_selected') }}</span>
                        </div>
                    </div>
                    <h3 class="format-name">Mexicano</h3>
                    <p class="format-desc">{{ $t('home_mexicano_desc_long') }}</p>
                    <ul class="format-checklist" aria-label="Features">
                        <li>✓ {{ $t('home_mexicano_feat1') }}</li>
                        <li>✓ {{ $t('home_mexicano_feat2') }}</li>
                        <li>✓ {{ $t('home_mexicano_feat3') }}</li>
                    </ul>
                    <span class="format-how-link">{{ $t('home_format_how') }} ›</span>
                </button>
            </div>
        </section>

        <!-- ─── Tournament history ────────────────────────── -->
        <section class="section">
            <h2 class="section-title">{{ $t('home_tournaments_section') }}</h2>

            <p v-if="history.length === 0" class="empty-state">
                {{ $t('home_tournaments_empty') }}
            </p>

            <div v-else class="tournament-list">
                <div
                    v-for="entry in history"
                    :key="entry.id"
                    class="tournament-card"
                    :class="entry.completed ? 'tournament-card--done' : 'tournament-card--live'"
                >
                    <!-- Card header -->
                    <div class="tc-header">
                        <span
                            class="tc-badge"
                            :class="entry.completed ? 'tc-badge--done' : 'tc-badge--live'"
                        >
                            {{ entry.completed ? $t('history_completed') : $t('history_ongoing') }}
                        </span>
                        <span class="tc-name">{{ entry.name }}</span>
                    </div>

                    <!-- Meta row -->
                    <p class="tc-meta">
                        <span class="tc-format">{{ entry.format }}</span>
                        <span class="tc-sep">·</span>
                        <span>{{ $t('history_players', { n: entry.numPlayers }) }}</span>
                        <span class="tc-sep">·</span>
                        <span v-if="!entry.completed">
                            {{ $t('history_next_round', { n: Math.min(entry.roundsPlayed + 1, entry.totalRounds), total: entry.totalRounds }) }}
                        </span>
                        <span v-else>
                            {{ $t('history_rounds_done', { n: entry.roundsPlayed, total: entry.totalRounds }) }}
                        </span>
                    </p>

                    <!-- Player chips -->
                    <div v-if="entry.top3 && entry.top3.length" class="tc-chips">
                        <span
                            v-for="(p, i) in entry.top3"
                            :key="i"
                            class="tc-chip"
                        >
                            <span class="chip-icon">{{ podiumIcon(i) }}</span>
                            {{ p.name }}
                            <span class="chip-score">{{ p.score }}</span>
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="tc-actions">
                        <template v-if="!entry.completed">
                            <button
                                v-if="isCurrentGame(entry)"
                                type="button"
                                class="btn-tc-primary"
                                @click="resumeGame"
                            >
                                {{ $t('history_continue_cta') }} →
                            </button>
                            <span v-else class="tc-stale-note">{{ $t('history_not_current') }}</span>
                        </template>
                        <template v-else>
                            <button
                                type="button"
                                class="btn-tc-secondary"
                                @click="toggleDetails(entry.id)"
                            >
                                {{ $t('history_details_cta') }}
                                <span class="details-chevron" :class="{ 'details-chevron--open': openedId === entry.id }">›</span>
                            </button>
                        </template>

                        <!-- Copy with seeding -->
                        <button
                            v-if="entry.players && entry.players.length && copyingId !== entry.id"
                            type="button"
                            class="btn-tc-ghost"
                            @click.stop="copyingId = entry.id"
                        >
                            🔁 {{ $t('history_copy') }}
                        </button>
                    </div>

                    <!-- Copy confirm -->
                    <div v-if="copyingId === entry.id" class="tc-copy-confirm">
                        <p class="tc-copy-text">{{ $t('history_copy_confirm') }}</p>
                        <div class="tc-copy-btns">
                            <button type="button" class="btn-tc-primary" @click="doCopy(entry)">
                                {{ $t('home_cta') }} →
                            </button>
                            <button type="button" class="btn-tc-ghost" @click.stop="copyingId = null">
                                {{ $t('end_confirm_cancel') }}
                            </button>
                        </div>
                    </div>

                    <!-- Expanded results -->
                    <div v-if="openedId === entry.id && entry.players && entry.players.length" class="tc-results">
                        <div
                            v-for="(p, i) in entry.players"
                            :key="i"
                            class="tc-result-row"
                        >
                            <span class="res-pos">{{ rankLabel(i) }}</span>
                            <span class="res-name">{{ p.name }}</span>
                            <span class="res-score">{{ p.score }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router/index";
import store from "@/store/index";
import { getHistory, TournamentSummary } from "@/services/tournamentHistoryService";
import type { GameMode } from "@/models/padelRules.interface";

export default defineComponent({
    name: "Home",
    data() {
        return {
            history: [] as TournamentSummary[],
            copyingId: null as string | null,
            openedId: null as string | null,
            selectedFormat: "Mexicano" as GameMode,
        };
    },
    mounted() {
        this.history = getHistory();
        // Sync with store, but default to Mexicano if store has never been set
        const storeMode = store.getters.americanoStore.getRules.mode as GameMode;
        this.selectedFormat = storeMode ?? "Mexicano";
    },
    computed: {
        hasSavedGame(): boolean {
            return store.getters.americanoStore.getIsGamePrepared;
        },
        currentTournamentId(): string {
            return store.getters.americanoStore.getTournamentId;
        },
        lastFormat(): string {
            return store.getters.americanoStore.getRules.mode;
        },
    },
    methods: {
        selectFormat(mode: GameMode) {
            this.selectedFormat = mode;
            store.commit.americanoStore.SET_MODE(mode);
        },
        startNew() {
            store.commit.americanoStore.SET_MODE(this.selectedFormat);
            router.push("/spil");
        },
        resumeGame() {
            router.push("/spil");
        },
        toggleDetails(id: string) {
            this.openedId = this.openedId === id ? null : id;
        },
        isCurrentGame(entry: TournamentSummary): boolean {
            return entry.id === this.currentTournamentId;
        },
        podiumIcon(index: number): string {
            return ["🥇", "🥈", "🥉"][index] ?? "";
        },
        rankLabel(index: number): string {
            const icons = ["🥇", "🥈", "🥉"];
            return index < icons.length ? (icons[index] ?? "") : String(index + 1);
        },
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
        async doCopy(entry: TournamentSummary) {
            await store.dispatch.americanoStore.copyFromHistory(entry);
            router.push("/spil");
        },
    },
});
</script>

<style scoped>
/* ── Page shell ─────────────────────────────────── */
.home-page {
    max-width: 660px;
    margin: 0 auto;
    padding: 1.25rem 1rem 5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* ── Hero ───────────────────────────────────────── */
.hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(140deg, #E05C10 0%, #F7A620 100%);
    padding: 2.25rem 1.75rem 1.75rem;
    box-shadow: 0 6px 28px rgba(220, 80, 10, 0.3);
}

/* subtle court lines */
.hero-bg-lines { position: absolute; inset: 0; pointer-events: none; }
.bg-line { position: absolute; background: rgba(255,255,255,0.08); }
.bg-line--v { width: 1px; top: 0; bottom: 0; left: 50%; }
.bg-line--h { height: 1px; left: 0; right: 0; top: 42%; }
.bg-circle {
    position: absolute; width: 180px; height: 180px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    right: -40px; bottom: -60px;
}

.hero-body { position: relative; z-index: 1; }

.hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    color: #fff;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; border-radius: 999px;
    padding: 0.28rem 0.75rem; margin-bottom: 0.9rem;
}

.hero-headline {
    font-size: clamp(1.5rem, 5vw, 2.1rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 0.55rem;
    max-width: 420px;
}

.hero-sub {
    font-size: 0.92rem;
    color: rgba(255,255,255,0.82);
    line-height: 1.5;
    margin: 0 0 1.6rem;
    max-width: 340px;
}

.hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1rem;
}

.btn-hero-primary {
    background: #fff;
    color: #E8580A;
    font-weight: 700;
    font-size: 0.97rem;
    font-family: inherit;
    border: none;
    border-radius: 14px;
    padding: 0.8rem 1.6rem;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    flex-shrink: 0;
}
.btn-hero-primary:hover { opacity: 0.9; }
.btn-hero-primary:active { transform: scale(0.97); }
.btn-hero-primary:focus-visible {
    outline: 3px solid rgba(255,255,255,0.8);
    outline-offset: 2px;
}

.btn-hero-secondary {
    background: rgba(255,255,255,0.18);
    color: #fff;
    font-weight: 600;
    font-size: 0.92rem;
    font-family: inherit;
    border: 1.5px solid rgba(255,255,255,0.4);
    border-radius: 14px;
    padding: 0.75rem 1.4rem;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
}
.btn-hero-secondary:hover { background: rgba(255,255,255,0.26); }
.btn-hero-secondary:active { transform: scale(0.97); }
.btn-hero-secondary:focus-visible {
    outline: 3px solid rgba(255,255,255,0.8);
    outline-offset: 2px;
}

.hero-format-hint {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.65);
    margin: 0;
}

/* ── USP strip ──────────────────────────────────── */
.usp-card {
    background: var(--surface);
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 1.1rem 1.2rem;
}

.usp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.4rem;
}

.usp-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 0.25rem;
    text-align: center;
}

.usp-icon { font-size: 1.35rem; line-height: 1; }
.usp-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--label-secondary);
    line-height: 1.25;
}

/* ── Section shared ─────────────────────────────── */
.section { display: flex; flex-direction: column; gap: 0.75rem; }

.section-title {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--label-primary);
    margin: 0;
}

/* ── Format cards ───────────────────────────────── */
.format-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    align-items: stretch;
}

.format-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    background: var(--surface);
    border: 2px solid var(--separator-opaque);
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    padding: 1.1rem;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
}
.format-card:hover {
    border-color: rgba(0,122,255,0.35);
    box-shadow: 0 4px 18px rgba(0,122,255,0.1);
}
.format-card:active { transform: scale(0.98); }
.format-card:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 2px;
}
.format-card--selected {
    border-color: var(--primary-color) !important;
    background: rgba(0,122,255,0.02);
    box-shadow: 0 0 0 3px rgba(0,122,255,0.12), 0 4px 18px rgba(0,122,255,0.1) !important;
}

.format-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.75rem;
}

/* icon circle */
.format-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; line-height: 1;
    flex-shrink: 0;
    background: rgba(52, 199, 89, 0.12); /* Americano default = green */
}
.format-card--mexicano .format-icon {
    background: rgba(0, 122, 255, 0.1); /* Mexicano = blue */
}

.format-badges { display: flex; gap: 0.3rem; align-items: center; flex-wrap: wrap; justify-content: flex-end; }

.format-popular-badge {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.04em;
    background: rgba(255, 149, 0, 0.1);
    color: #B35900;
    border: 1px solid rgba(255,149,0,0.2);
    border-radius: 999px; padding: 0.2rem 0.5rem;
}

.format-selected-badge {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.04em;
    background: rgba(0,122,255,0.1);
    color: var(--primary-color);
    border: 1px solid rgba(0,122,255,0.2);
    border-radius: 999px; padding: 0.2rem 0.5rem;
}

.format-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--label-primary);
    margin: 0 0 0.3rem;
    line-height: 1.1;
}

.format-desc {
    font-size: 0.78rem;
    color: var(--label-secondary);
    margin: 0 0 0.5rem;
    line-height: 1.45;
    flex: 1;
}

.format-checklist {
    list-style: none;
    padding: 0;
    margin: 0 0 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.22rem;
}
.format-checklist li {
    font-size: 0.74rem;
    color: var(--label-secondary);
    font-weight: 500;
    line-height: 1.3;
}
.format-checklist li::before { content: ""; }

.format-how-link {
    font-size: 0.72rem;
    color: var(--primary-color);
    font-weight: 600;
    margin-top: auto;
    padding-top: 0.4rem;
}

/* ── Tournament cards ───────────────────────────── */
.tournament-list { display: flex; flex-direction: column; gap: 0.75rem; }

.tournament-card {
    background: var(--surface);
    border-radius: 18px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 1.1rem 1.2rem;
    border-left: 4px solid transparent;
}
.tournament-card--live { border-left-color: var(--primary-color); }
.tournament-card--done { border-left-color: var(--secondary-color); }

.tc-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
}

.tc-badge {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em;
    border-radius: 999px; padding: 0.2rem 0.6rem; flex-shrink: 0;
}
.tc-badge--live { background: rgba(0,122,255,0.1); color: var(--primary-color); }
.tc-badge--done { background: rgba(52,199,89,0.1); color: var(--secondary-color); }

.tc-name {
    font-weight: 700;
    font-size: 1rem;
    color: var(--label-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tc-meta {
    font-size: 0.78rem;
    color: var(--label-secondary);
    margin: 0 0 0.7rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
}
.tc-format { font-weight: 600; }
.tc-sep { color: var(--separator-opaque); }

.tc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
}

.tc-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: var(--bg);
    border: 1px solid var(--separator-opaque);
    border-radius: 999px;
    padding: 0.28rem 0.7rem 0.28rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--label-primary);
    white-space: nowrap;
}
.chip-icon { font-size: 0.85rem; }
.chip-score {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary-color);
    background: rgba(0,122,255,0.08);
    border-radius: 999px;
    padding: 0.05rem 0.35rem;
    margin-left: 0.05rem;
}

.tc-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
}

.btn-tc-primary {
    background: var(--primary-color);
    color: #fff;
    font-weight: 700;
    font-size: 0.88rem;
    font-family: inherit;
    border: none;
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    flex-shrink: 0;
}
.btn-tc-primary:hover { opacity: 0.88; }
.btn-tc-primary:active { transform: scale(0.97); }
.btn-tc-primary:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }

.btn-tc-secondary {
    background: var(--bg);
    color: var(--label-primary);
    font-weight: 600;
    font-size: 0.88rem;
    font-family: inherit;
    border: 1.5px solid var(--separator-opaque);
    border-radius: 12px;
    padding: 0.55rem 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
}
.btn-tc-secondary:hover { background: var(--separator-opaque); }
.btn-tc-secondary:active { transform: scale(0.97); }
.btn-tc-secondary:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }

.details-chevron {
    display: inline-block;
    font-size: 1rem;
    transition: transform 0.2s;
    line-height: 1;
}
.details-chevron--open { transform: rotate(90deg); }

.btn-tc-ghost {
    background: none;
    color: var(--primary-color);
    font-weight: 600;
    font-size: 0.82rem;
    font-family: inherit;
    border: 1.5px solid rgba(0,122,255,0.3);
    border-radius: 10px;
    padding: 0.5rem 0.9rem;
    cursor: pointer;
    transition: background 0.14s;
    flex-shrink: 0;
}
.btn-tc-ghost:hover { background: rgba(0,122,255,0.06); }
.btn-tc-ghost:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }

.tc-stale-note {
    font-size: 0.78rem;
    color: var(--label-secondary);
    font-style: italic;
}

/* ── Copy confirm ───────────────────────────────── */
.tc-copy-confirm {
    margin-top: 0.75rem;
    background: var(--bg);
    border-radius: 12px;
    padding: 0.85rem;
}
.tc-copy-text {
    font-size: 0.82rem;
    color: var(--label-secondary);
    margin: 0 0 0.65rem;
    line-height: 1.4;
}
.tc-copy-btns { display: flex; gap: 0.5rem; }
.tc-copy-btns .btn-tc-primary { flex: 1; text-align: center; }

/* ── Results panel ──────────────────────────────── */
.tc-results {
    margin-top: 0.85rem;
    border-top: 1px solid var(--separator-opaque);
    padding-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.tc-result-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.42rem 0.25rem;
    border-radius: 8px;
    transition: background 0.1s;
}
.tc-result-row:hover { background: var(--bg); }

.res-pos {
    min-width: 1.8rem;
    text-align: center;
    font-size: 0.82rem;
    color: var(--label-secondary);
    font-weight: 600;
    flex-shrink: 0;
}
.res-name {
    flex: 1;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--label-primary);
}
.res-score {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--primary-color);
}

/* ── Empty state ────────────────────────────────── */
.empty-state {
    font-size: 0.9rem;
    color: var(--label-secondary);
    text-align: center;
    padding: 2rem 1rem;
    background: var(--surface);
    border-radius: 18px;
    margin: 0;
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 500px) {
    .hero { padding: 2rem 1.4rem 1.6rem; }
    .hero-headline { font-size: 1.4rem; }

    .hero-ctas { flex-direction: column; }
    .btn-hero-primary,
    .btn-hero-secondary { width: 100%; text-align: center; }

    .usp-grid { grid-template-columns: 1fr 1fr; gap: 0.3rem; }
    .usp-item { padding: 0.6rem 0.4rem; }

    .format-grid { grid-template-columns: 1fr; }

    .tc-actions { flex-direction: column; align-items: stretch; }
    .btn-tc-primary,
    .btn-tc-secondary,
    .btn-tc-ghost { width: 100%; text-align: center; justify-content: center; }
}
</style>
