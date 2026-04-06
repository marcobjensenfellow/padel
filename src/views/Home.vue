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
                    <div class="usp-icon-wrap usp-icon-wrap--orange">🎯</div>
                    <span class="usp-label">{{ $t('home_feat1_title') }}</span>
                </div>
                <div class="usp-item">
                    <div class="usp-icon-wrap usp-icon-wrap--blue">↔️</div>
                    <span class="usp-label">{{ $t('home_feat2_title') }}</span>
                </div>
                <div class="usp-item">
                    <div class="usp-icon-wrap usp-icon-wrap--green">💾</div>
                    <span class="usp-label">{{ $t('home_feat3_title') }}</span>
                </div>
                <div class="usp-item">
                    <div class="usp-icon-wrap usp-icon-wrap--purple">🔄</div>
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
    max-width: 680px;
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
    border-radius: 28px;
    background: #0F172A;
    padding: 2.5rem 2rem 2rem;
    box-shadow: 0 8px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18);
}

/* mesh gradient overlay */
.hero-bg-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
        radial-gradient(at 0% 0%,   rgba(255,95,0,0.22)  0px, transparent 55%),
        radial-gradient(at 50% 0%,  rgba(0,82,255,0.12)  0px, transparent 55%),
        radial-gradient(at 100% 0%, rgba(255,95,0,0.18)  0px, transparent 55%),
        radial-gradient(at 80% 80%, rgba(0,82,255,0.08)  0px, transparent 45%);
}

/* decorative blur orbs */
.bg-line { display: none; }
.bg-circle {
    position: absolute;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(255,95,0,0.15) 0%, transparent 70%);
    border-radius: 50%;
    right: -60px; top: -80px;
    pointer-events: none;
}

.hero-body { position: relative; z-index: 1; }

.hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.80);
    font-size: 0.63rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(8px);
}
.hero-badge::before {
    content: '';
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #FF5F00;
    box-shadow: 0 0 6px rgba(255,95,0,0.8);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.8); }
}

.hero-headline {
    font-size: clamp(1.55rem, 5.5vw, 2.3rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    color: #fff;
    line-height: 1.1;
    margin: 0 0 0.65rem;
    max-width: 420px;
}

.hero-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.58);
    line-height: 1.55;
    margin: 0 0 1.75rem;
    max-width: 340px;
}

.hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.1rem;
}

.btn-hero-primary {
    background: #FF5F00;
    color: #fff;
    font-weight: 800;
    font-size: 0.95rem;
    font-family: inherit;
    border: none;
    border-radius: 14px;
    padding: 0.85rem 1.8rem;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    flex-shrink: 0;
    letter-spacing: -0.01em;
    box-shadow: 0 4px 20px rgba(255,95,0,0.35);
}
.btn-hero-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-hero-primary:active { transform: scale(0.97); }
.btn-hero-primary:focus-visible {
    outline: 3px solid rgba(255,255,255,0.8);
    outline-offset: 2px;
}

.btn-hero-secondary {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.85);
    font-weight: 700;
    font-size: 0.92rem;
    font-family: inherit;
    border: 1.5px solid rgba(255,255,255,0.18);
    border-radius: 14px;
    padding: 0.82rem 1.5rem;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
}
.btn-hero-secondary:hover { background: rgba(255,255,255,0.14); transform: translateY(-1px); }
.btn-hero-secondary:active { transform: scale(0.97); }
.btn-hero-secondary:focus-visible {
    outline: 3px solid rgba(255,255,255,0.8);
    outline-offset: 2px;
}

.hero-format-hint {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.38);
    margin: 0;
    letter-spacing: 0.01em;
}

/* ── USP strip ──────────────────────────────────── */
.usp-card {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow);
    border: 1px solid var(--separator);
    padding: 1rem 1.2rem;
}

.usp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

.usp-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.6rem 0.3rem;
    text-align: center;
    border-radius: var(--radius);
    transition: background 0.15s;
}
.usp-item:hover { background: var(--bg); }

.usp-icon-wrap {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.usp-icon-wrap--orange { background: rgba(255,95,0,0.10); }
.usp-icon-wrap--blue   { background: rgba(0,82,255,0.10); }
.usp-icon-wrap--green  { background: rgba(16,185,129,0.10); }
.usp-icon-wrap--purple { background: rgba(139,92,246,0.10); }

.usp-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--label-secondary);
    line-height: 1.25;
    letter-spacing: 0.01em;
}

/* ── Section shared ─────────────────────────────── */
.section { display: flex; flex-direction: column; gap: 0.75rem; }

.section-title {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--label);
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
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    padding: 1.2rem;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.12s;
    -webkit-tap-highlight-color: transparent;
}
.format-card:hover {
    border-color: rgba(0,82,255,0.40);
    box-shadow: var(--shadow), 0 0 0 0px rgba(0,82,255,0.10);
    transform: translateY(-1px);
}
.format-card:active { transform: scale(0.98); }
.format-card:focus-visible {
    outline: 3px solid var(--padel-blue);
    outline-offset: 2px;
}
.format-card--selected {
    border-color: var(--padel-blue) !important;
    background: rgba(0,82,255,0.02);
    box-shadow: 0 0 0 3px rgba(0,82,255,0.14), var(--shadow) !important;
}

.format-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.85rem;
}

.format-icon {
    width: 42px; height: 42px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; line-height: 1;
    flex-shrink: 0;
    background: rgba(16,185,129,0.12);
}
.format-card--mexicano .format-icon {
    background: rgba(0,82,255,0.10);
}

.format-badges { display: flex; gap: 0.3rem; align-items: center; flex-wrap: wrap; justify-content: flex-end; }

.format-popular-badge {
    font-size: 0.58rem; font-weight: 800; letter-spacing: 0.06em;
    background: rgba(255,95,0,0.10);
    color: var(--padel-orange);
    border: 1px solid rgba(255,95,0,0.18);
    border-radius: 999px; padding: 0.22rem 0.55rem;
    text-transform: uppercase;
}

.format-selected-badge {
    font-size: 0.58rem; font-weight: 800; letter-spacing: 0.06em;
    background: rgba(0,82,255,0.10);
    color: var(--padel-blue);
    border: 1px solid rgba(0,82,255,0.18);
    border-radius: 999px; padding: 0.22rem 0.55rem;
    text-transform: uppercase;
}

.format-name {
    font-size: 1rem;
    font-weight: 800;
    color: var(--label);
    margin: 0 0 0.35rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
}

.format-desc {
    font-size: 0.77rem;
    color: var(--label-secondary);
    margin: 0 0 0.55rem;
    line-height: 1.45;
    flex: 1;
}

.format-checklist {
    list-style: none;
    padding: 0;
    margin: 0 0 0.55rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.format-checklist li {
    font-size: 0.73rem;
    color: var(--label-secondary);
    font-weight: 600;
    line-height: 1.3;
}
.format-checklist li::before { content: ""; }

.format-how-link {
    font-size: 0.71rem;
    color: var(--padel-blue);
    font-weight: 700;
    margin-top: auto;
    padding-top: 0.4rem;
    letter-spacing: 0.01em;
}

/* ── Tournament cards ───────────────────────────── */
.tournament-list { display: flex; flex-direction: column; gap: 0.75rem; }

.tournament-card {
    background: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--separator);
    border-left: 4px solid transparent;
    padding: 1.2rem 1.3rem;
    transition: transform 0.15s, box-shadow 0.15s;
}
.tournament-card:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.tournament-card--live { border-left-color: var(--padel-blue); }
.tournament-card--done { border-left-color: var(--secondary-color); }

.tc-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
}

.tc-badge {
    font-size: 0.62rem; font-weight: 800; letter-spacing: 0.07em;
    text-transform: uppercase;
    border-radius: 999px; padding: 0.22rem 0.65rem; flex-shrink: 0;
}
.tc-badge--live { background: rgba(0,82,255,0.10); color: var(--padel-blue); }
.tc-badge--done { background: rgba(16,185,129,0.10); color: #059669; }

.tc-name {
    font-weight: 800;
    font-size: 0.97rem;
    color: var(--label);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.015em;
}

.tc-meta {
    font-size: 0.77rem;
    color: var(--label-secondary);
    margin: 0 0 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
}
.tc-format { font-weight: 700; color: var(--label); }
.tc-sep { color: var(--separator-opaque); }

.tc-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.9rem;
}

.tc-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: var(--bg);
    border: 1px solid var(--separator-opaque);
    border-radius: 999px;
    padding: 0.3rem 0.75rem 0.3rem 0.5rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--label);
    white-space: nowrap;
}
.chip-icon { font-size: 0.85rem; }
.chip-score {
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--padel-blue);
    background: var(--padel-blue-light);
    border-radius: 999px;
    padding: 0.05rem 0.38rem;
    margin-left: 0.05rem;
}

.tc-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
}

.btn-tc-primary {
    background: var(--padel-blue);
    color: #fff;
    font-weight: 800;
    font-size: 0.87rem;
    font-family: inherit;
    border: none;
    border-radius: var(--radius);
    padding: 0.62rem 1.25rem;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    flex-shrink: 0;
    letter-spacing: -0.01em;
}
.btn-tc-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-tc-primary:active { transform: scale(0.97); }
.btn-tc-primary:focus-visible { outline: 3px solid var(--padel-blue); outline-offset: 3px; }

.btn-tc-secondary {
    background: var(--bg);
    color: var(--label);
    font-weight: 700;
    font-size: 0.87rem;
    font-family: inherit;
    border: 1.5px solid var(--separator-opaque);
    border-radius: var(--radius);
    padding: 0.58rem 1.05rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
}
.btn-tc-secondary:hover { background: var(--separator-opaque); }
.btn-tc-secondary:active { transform: scale(0.97); }
.btn-tc-secondary:focus-visible { outline: 3px solid var(--padel-blue); outline-offset: 3px; }

.details-chevron {
    display: inline-block;
    font-size: 1rem;
    transition: transform 0.2s;
    line-height: 1;
}
.details-chevron--open { transform: rotate(90deg); }

.btn-tc-ghost {
    background: none;
    color: var(--padel-blue);
    font-weight: 700;
    font-size: 0.82rem;
    font-family: inherit;
    border: 1.5px solid rgba(0,82,255,0.25);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.9rem;
    cursor: pointer;
    transition: background 0.14s;
    flex-shrink: 0;
}
.btn-tc-ghost:hover { background: var(--padel-blue-light); }
.btn-tc-ghost:focus-visible { outline: 3px solid var(--padel-blue); outline-offset: 3px; }

.tc-stale-note {
    font-size: 0.78rem;
    color: var(--label-secondary);
    font-style: italic;
}

/* ── Copy confirm ───────────────────────────────── */
.tc-copy-confirm {
    margin-top: 0.75rem;
    background: var(--bg);
    border-radius: var(--radius);
    padding: 0.9rem;
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
    margin-top: 0.9rem;
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
    padding: 0.44rem 0.3rem;
    border-radius: var(--radius-sm);
    transition: background 0.1s;
}
.tc-result-row:hover { background: var(--bg); }

.res-pos {
    min-width: 1.9rem;
    text-align: center;
    font-size: 0.82rem;
    color: var(--label-secondary);
    font-weight: 700;
    flex-shrink: 0;
}
.res-name {
    flex: 1;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--label);
}
.res-score {
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--padel-blue);
}

/* ── Empty state ────────────────────────────────── */
.empty-state {
    font-size: 0.9rem;
    color: var(--label-secondary);
    text-align: center;
    padding: 2rem 1rem;
    background: var(--surface);
    border-radius: var(--radius-xl);
    border: 1px solid var(--separator);
    margin: 0;
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 500px) {
    .hero { padding: 2rem 1.5rem 1.75rem; border-radius: 22px; }
    .hero-headline { font-size: 1.45rem; }

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
