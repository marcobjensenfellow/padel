<template>
    <div v-if="getGames.length > 0" class="games-page">

        <!-- Header -->
        <div class="games-header">
            <h1>Round {{ activeRound }}</h1>
            <p class="games-subtitle">{{ completedCount }}/{{ totalMatchCount }} matches scored</p>
        </div>

        <!-- Round pills -->
        <div class="round-pills">
            <button
                v-for="round in rounds"
                :key="round"
                class="round-pill"
                :class="{
                    'round-pill--active': activeRound === round,
                    'round-pill--done':   isRoundComplete(round) && activeRound !== round,
                }"
                @click="activeRound = round"
            >
                {{ isRoundComplete(round) ? '✓' : round }}
            </button>
        </div>

        <!-- Courts -->
        <div class="courts-grid">
            <template v-for="game in gamesForActiveRound" :key="game.id">

                <!-- Rest round -->
                <div v-if="game.players.length < 4" class="rest-card">
                    <span class="rest-icon">☕️</span>
                    <span class="rest-name">{{ getPlayerNameById(game.players[0].playerId) }}</span>
                    <span class="rest-label">Sitting out</span>
                </div>

                <!-- Court card -->
                <div v-else class="court-card">
                    <div class="court-label">{{ getCourtLabel(game) }}</div>

                    <!-- Home team -->
                    <div
                        class="team-zone"
                        @click="openPicker(game, true)"
                    >
                        <div class="player-list-inline">
                            <div
                                v-for="ps in homePlayers(game)"
                                :key="ps.playerId"
                                class="player-chip"
                            >
                                <span class="chip-name">{{ getPlayerNameById(ps.playerId) }}</span>
                                <span class="chip-side" :class="ps.side === 'Right' ? 'chip-side--r' : 'chip-side--l'">
                                    {{ ps.side === 'Right' ? 'R' : 'L' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Score row -->
                    <div class="score-row">
                        <div
                            class="score-pill"
                            :class="{ 'score-pill--set': game.homeScore !== null }"
                            @click="openPicker(game, true)"
                        >{{ game.homeScore !== null ? game.homeScore : '–' }}</div>

                        <div class="score-divider"></div>

                        <div
                            class="score-pill"
                            :class="{ 'score-pill--set': game.awayScore !== null }"
                            @click="openPicker(game, false)"
                        >{{ game.awayScore !== null ? game.awayScore : '–' }}</div>
                    </div>

                    <!-- Away team -->
                    <div
                        class="team-zone team-zone--away"
                        @click="openPicker(game, false)"
                    >
                        <div class="player-list-inline">
                            <div
                                v-for="ps in awayPlayers(game)"
                                :key="ps.playerId"
                                class="player-chip"
                            >
                                <span class="chip-name">{{ getPlayerNameById(ps.playerId) }}</span>
                                <span class="chip-side" :class="ps.side === 'Right' ? 'chip-side--r' : 'chip-side--l'">
                                    {{ ps.side === 'Right' ? 'R' : 'L' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </template>
        </div>

        <!-- Actions -->
        <div class="games-actions">
            <div class="games-actions-secondary">
                <button type="button" @click="goBack" class="btn-pdl-ghost">
                    ← Setup
                </button>
                <button type="button" @click="confirmReset = true" class="btn-pdl-ghost btn-danger-ghost">
                    End tournament
                </button>
            </div>
            <button
                type="button"
                @click="onCalculateScore"
                class="btn-pdl btn-calculate"
                :disabled="!allRoundScoresSet"
            >
                {{ allRoundScoresSet ? 'See results →' : 'Score all matches first' }}
            </button>
        </div>

        <!-- Score picker -->
        <ScorePicker
            v-if="pickerGame !== null"
            :game="pickerGame"
            :scoring-home="pickerScoringHome"
            :max-score="getRules.maxScore"
            :players="getPlayers"
            @score-set="onScoreSet"
            @close="pickerGame = null"
        />

        <!-- End tournament confirm -->
        <div v-if="confirmReset" class="confirm-overlay" @click.self="confirmReset = false">
            <div class="confirm-sheet">
                <p class="confirm-icon">⚠️</p>
                <h3>End tournament?</h3>
                <p class="confirm-body">All scores and player data will be deleted. This can't be undone.</p>
                <button class="btn-pdl btn-destructive" @click="reset">Yes, end it</button>
                <button class="btn-pdl-ghost" @click="confirmReset = false">Cancel</button>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { PadelGame } from "@/models/padelGame.interface";
import { PlayerScore } from "@/models/playerScore.interface";
import ScorePicker from "./ScorePicker.vue";

export default defineComponent({
    components: { ScorePicker },
    data() {
        return {
            activeRound: 1 as number,
            pickerGame: null as PadelGame | null,
            pickerScoringHome: true as boolean,
            confirmReset: false,
        };
    },
    mounted() {
        const incomplete = this.rounds.find(r => !this.isRoundComplete(r));
        this.activeRound = incomplete ?? this.rounds[this.rounds.length - 1];
    },
    computed: {
        getGames(): readonly PadelGame[] {
            return store.getters.americanoStore.getGames;
        },
        getPlayers() {
            return store.getters.americanoStore.getPlayers;
        },
        getRules() {
            return store.getters.americanoStore.getRules;
        },
        rounds(): number[] {
            const max = Math.max(...this.getGames.map(g => g.round));
            return Array.from({ length: max }, (_, i) => i + 1);
        },
        gamesForActiveRound(): readonly PadelGame[] {
            return this.getGames.filter(g => g.round === this.activeRound);
        },
        totalMatchCount(): number {
            return this.gamesForActiveRound.filter(g => g.players.length === 4).length;
        },
        completedCount(): number {
            return this.gamesForActiveRound.filter(
                g => g.players.length === 4 && g.homeScore !== null && g.awayScore !== null
            ).length;
        },
        allRoundScoresSet(): boolean {
            return this.totalMatchCount > 0 && this.completedCount === this.totalMatchCount;
        },
    },
    methods: {
        isRoundComplete(round: number): boolean {
            return this.getGames
                .filter(g => g.round === round && g.players.length === 4)
                .every(g => g.homeScore !== null && g.awayScore !== null);
        },
        homePlayers(game: PadelGame): PlayerScore[] {
            return game.players.filter(p => p.home);
        },
        awayPlayers(game: PadelGame): PlayerScore[] {
            return game.players.filter(p => !p.home);
        },
        getPlayerNameById(id: number): string {
            return store.getters.americanoStore.getPlayers.find((p: any) => p.id === id)?.name ?? "";
        },
        getCourtLabel(game: PadelGame): string {
            const rules = this.getRules;
            const courts = Math.floor(rules.amountOfPlayers / 4);
            let courtIndex = game.matchNumber - 1;
            if (rules.amountOfPlayers === 16) {
                courtIndex = (game.playGroup - 1) * 2 + (game.matchNumber - 1);
            }
            if (courtIndex < 0 || courtIndex >= courts) courtIndex = 0;
            const named = rules.courtNames?.[courtIndex];
            return named?.trim() ? named : `Court ${courtIndex + 1}`;
        },
        openPicker(game: PadelGame, scoringHome: boolean) {
            this.pickerGame = game;
            this.pickerScoringHome = scoringHome;
        },
        onScoreSet(payload: { game: PadelGame; homeScore: number; awayScore: number }) {
            payload.game.homeScore = payload.homeScore;
            payload.game.awayScore = payload.awayScore;
            store.dispatch.americanoStore.saveStateManually();
            this.pickerGame = null;
        },
        onCalculateScore() {
            store.dispatch.americanoStore.updatePlayerScores();
        },
        goBack() {
            store.dispatch.americanoStore.sortPlayersById();
            store.commit.americanoStore.DECREMENT_STEP();
        },
        reset() {
            store.commit.americanoStore.RESET();
            this.confirmReset = false;
        },
    },
});
</script>

<style scoped>
.games-page {
    max-width: 680px;
    margin: 0 auto;
    padding: 1rem 1rem 6rem;
}

/* Header */
.games-header { margin-bottom: 1rem; }
.games-header h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; margin: 0; }
.games-subtitle { margin: 0.1rem 0 0; color: var(--label-secondary); font-size: 0.9rem; }

/* Round pills */
.round-pills {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-bottom: 1.2rem;
}

.round-pill {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid var(--separator-opaque);
    background: var(--surface);
    color: var(--label-secondary);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
}

.round-pill--active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
}

.round-pill--done {
    background: rgba(52,199,89,0.12);
    border-color: var(--secondary-color);
    color: var(--secondary-color);
}

/* Courts grid */
.courts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

/* Court card */
.court-card {
    background: #C2784A;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
}

.court-label {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    padding: 0.5rem;
    background: rgba(0,0,0,0.2);
}

.team-zone {
    padding: 0.85rem 1rem;
    cursor: pointer;
    transition: background 0.12s;
    min-height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.12);
}

.team-zone:hover    { background: rgba(0,0,0,0.22); }
.team-zone--away    { border-top: 1.5px solid rgba(255,255,255,0.18); }

.player-list-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
}

.player-chip {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(28,28,30,0.7);
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
}

.chip-name {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
}

.chip-side {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    font-size: 0.62rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chip-side--l { background: #0fb9b1; color: #fff; }
.chip-side--r { background: #3b82f6; color: #fff; }

/* Score row */
.score-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.5rem;
    background: rgba(255,255,255,0.06);
}

.score-divider {
    width: 2px;
    height: 28px;
    background: rgba(255,255,255,0.4);
    border-radius: 1px;
}

.score-pill {
    min-width: 52px;
    height: 52px;
    border-radius: 26px;
    border: 2px solid rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.7);
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.12s;
    letter-spacing: -0.02em;
}

.score-pill:hover      { background: rgba(255,255,255,0.22); }
.score-pill--set       { background: rgba(255,255,255,0.92); color: #1C1C1E; border-color: transparent; }

/* Rest card */
.rest-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    gap: 0.3rem;
}

.rest-icon  { font-size: 1.8rem; }
.rest-name  { font-weight: 700; font-size: 1rem; }
.rest-label { color: var(--label-secondary); font-size: 0.82rem; }

/* Actions */
.games-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.games-actions-secondary {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-danger-ghost { color: var(--destructive-color) !important; }

.btn-calculate {
    width: 100%;
    padding: 1rem;
    font-size: 1.05rem;
    border-radius: var(--radius-lg);
}

/* Confirm overlay */
.confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 200;
}

.confirm-sheet {
    background: var(--surface);
    border-radius: 24px 24px 0 0;
    padding: 1.5rem 1.5rem 3rem;
    width: 100%;
    max-width: 600px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    animation: slide-up 0.22s ease-out;
}

.confirm-icon { font-size: 2.5rem; margin: 0; }
.confirm-body { color: var(--label-secondary); font-size: 0.9rem; max-width: 280px; margin: 0 0 0.5rem; }

.btn-destructive {
    background: var(--destructive-color) !important;
    width: 100%;
    padding: 0.9rem;
    border-radius: var(--radius-lg);
}

@keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
}

@media (min-width: 600px) {
    .confirm-overlay { align-items: center; }
    .confirm-sheet { border-radius: 24px; max-width: 400px; padding-bottom: 2rem; }
}
</style>
