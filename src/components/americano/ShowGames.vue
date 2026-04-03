<template>
    <div v-if="getGames.length > 0">
        <!-- Round tabs -->
        <div class="round-tabs">
            <button
                v-for="round in rounds"
                :key="round"
                class="round-tab"
                :class="{ 'round-tab--active': activeRound === round }"
                @click="activeRound = round"
            >
                Round {{ round }}
                <span v-if="isRoundComplete(round)" class="round-check">✓</span>
            </button>
        </div>

        <!-- Courts for active round -->
        <div class="courts-grid">
            <template v-for="game in gamesForActiveRound" :key="game.id">
                <!-- Rest round -->
                <div v-if="game.players.length < 4" class="rest-card">
                    <span class="rest-icon">😴</span>
                    <span>Rest: {{ getPlayerNameById(game.players[0].playerId) }}</span>
                </div>

                <!-- Court card -->
                <div v-else class="court-card">
                    <div class="court-label">{{ getCourtLabel(game) }}</div>

                    <!-- Home team — click to score -->
                    <div
                        class="team-zone team-zone--home"
                        @click="openPicker(game, true)"
                        :class="{ 'team-zone--scored': game.homeScore !== null }"
                    >
                        <div class="player-pills">
                            <span
                                v-for="ps in homePlayers(game)"
                                :key="ps.playerId"
                                class="player-pill"
                            >
                                {{ getPlayerNameById(ps.playerId) }}
                                <span class="side-dot" :class="ps.side === 'Right' ? 'side-dot--right' : 'side-dot--left'">
                                    {{ ps.side === 'Right' ? 'R' : 'L' }}
                                </span>
                            </span>
                        </div>
                    </div>

                    <!-- Score display -->
                    <div class="court-score">
                        <div
                            class="score-bubble"
                            :class="{ 'score-bubble--set': game.homeScore !== null }"
                            @click="openPicker(game, true)"
                        >
                            {{ game.homeScore !== null ? game.homeScore : '?' }}
                        </div>
                        <div class="court-net"></div>
                        <div
                            class="score-bubble"
                            :class="{ 'score-bubble--set': game.awayScore !== null }"
                            @click="openPicker(game, false)"
                        >
                            {{ game.awayScore !== null ? game.awayScore : '?' }}
                        </div>
                    </div>

                    <!-- Away team — click to score -->
                    <div
                        class="team-zone team-zone--away"
                        @click="openPicker(game, false)"
                        :class="{ 'team-zone--scored': game.awayScore !== null }"
                    >
                        <div class="player-pills">
                            <span
                                v-for="ps in awayPlayers(game)"
                                :key="ps.playerId"
                                class="player-pill"
                            >
                                {{ getPlayerNameById(ps.playerId) }}
                                <span class="side-dot" :class="ps.side === 'Right' ? 'side-dot--right' : 'side-dot--left'">
                                    {{ ps.side === 'Right' ? 'R' : 'L' }}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Actions -->
        <div class="clearfix mt-3">
            <div class="float-left">
                <button type="button" @click="goBack" class="btn btn-pdl mt-1">
                    <i class="las la-arrow-left"></i> Change teams
                </button>
                <button type="button" @click="reset" class="btn btn-pdl mt-1 ml-2">
                    <i class="las la-times"></i> Start over
                </button>
            </div>
            <div class="float-right">
                <button
                    type="button"
                    @click="onCalculateScore"
                    class="btn btn-pdl mt-1"
                    :disabled="!allRoundScoresSet"
                >
                    Calculate results <i class="las la-arrow-right"></i>
                </button>
            </div>
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
        };
    },

    mounted() {
        // Start on the first incomplete round, or the last round
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
        allRoundScoresSet(): boolean {
            return this.gamesForActiveRound
                .filter(g => g.players.length === 4)
                .every(g => g.homeScore !== null && g.awayScore !== null);
        },
    },

    methods: {
        rounds_for(r: number) {
            return this.getGames.filter(g => g.round === r);
        },
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
            const player = store.getters.americanoStore.getPlayers.find(
                (p: any) => p.id === id
            );
            return player ? player.name : "";
        },
        getCourtLabel(game: PadelGame): string {
            const rules = this.getRules;
            const courts = Math.floor(rules.amountOfPlayers / 4);
            let courtIndex = game.matchNumber - 1;
            if (rules.amountOfPlayers === 16) {
                courtIndex = (game.playGroup - 1) * 2 + (game.matchNumber - 1);
            }
            if (courtIndex < 0 || courtIndex >= courts) {
                courtIndex = 0;
            }
            const named = rules.courtNames?.[courtIndex];
            return named && named.trim() ? named : `Court ${courtIndex + 1}`;
        },
        openPicker(game: PadelGame, scoringHome: boolean) {
            this.pickerGame = game;
            this.pickerScoringHome = scoringHome;
        },
        onScoreSet(payload: {
            game: PadelGame;
            homeScore: number;
            awayScore: number;
        }) {
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
        },
    },
});
</script>

<style scoped>
/* Round tabs */
.round-tabs {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-bottom: 1.2rem;
    justify-content: center;
}

.round-tab {
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    border: 2px solid var(--primary-color);
    background: #fff;
    color: var(--primary-color);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.round-tab--active {
    background: var(--primary-color);
    color: #fff;
}

.round-check {
    margin-left: 0.3rem;
    font-size: 0.8rem;
}

/* Courts grid */
.courts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}

/* Court card */
.court-card {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0,0,0,0.13);
    background: #c2784a; /* clay */
    display: flex;
    flex-direction: column;
    position: relative;
}

.court-label {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.75);
    padding: 0.4rem;
    background: rgba(0,0,0,0.25);
}

/* Team zones */
.team-zone {
    padding: 0.8rem 1rem;
    cursor: pointer;
    transition: background 0.15s;
    background: rgba(0,0,0,0.15);
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.team-zone:hover {
    background: rgba(0,0,0,0.28);
}

.team-zone--scored {
    background: rgba(0,0,0,0.1);
}

.team-zone--home {
    border-bottom: 2px solid rgba(255,255,255,0.3);
}

.team-zone--away {
    border-top: 2px solid rgba(255,255,255,0.3);
}

.player-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
}

.player-pill {
    background: rgba(47, 54, 64, 0.85);
    color: #fff;
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
    font-size: 0.82rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.side-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 0.65rem;
    font-weight: 700;
}

.side-dot--left {
    background: #0fb9b1;
    color: #fff;
}

.side-dot--right {
    background: #3b82f6;
    color: #fff;
}

/* Score area */
.court-score {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    background: rgba(255,255,255,0.08);
}

.court-net {
    width: 2px;
    height: 30px;
    background: rgba(255,255,255,0.5);
    border-radius: 1px;
}

.score-bubble {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.5);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
}

.score-bubble:hover {
    background: rgba(255,255,255,0.35);
}

.score-bubble--set {
    background: rgba(255,255,255,0.9);
    color: #2f3640;
    border-color: #fff;
}

/* Rest card */
.rest-card {
    border-radius: 14px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem;
    color: #888;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.rest-icon {
    font-size: 1.4rem;
}
</style>
