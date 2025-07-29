<template>
    <div v-if="getGames.length > 0">
        <h3 class="text-center">Matcher</h3>
        <form @submit.prevent="onCalculateScore">
            <div class="form-group">
                <div class="score-container">
                    <div v-for="(game, index) in getGames" :key="game.id">
                        <div
                            v-if="IsNewRound(index, getGames.length)"
                            class="score-round"
                        >
                            Omgång: {{ game.round }}
                        </div>
                        <div
                            :class="{
                                'top-border': shouldHaveTopBorder(game),
                                'is-second': getColorCodeGroup(game) === 2,
                                'is-first': getColorCodeGroup(game) === 1,
                            }"
                            class="game-container"
                        >
                            <div
                                v-if="game.players.length === 4"
                                class="d-flex flex-row justify-content-between"
                            >
                                <div class="team-element p-2">
                                    <span class="team">{{
                                        getPlayerNames(game, 1)
                                    }}</span>
                                    <span class="vs"> vs </span>
                                    <span class="team">{{
                                        getPlayerNames(game, 2)
                                    }}</span>
                                </div>

                                <span class="team-element pt-2">
                                    {{ printCourt(index) }}</span
                                >

                                <div class="team-element p-2 align-self-center">
                                    <input
                                        v-model="game.homeScore"
                                        class="input-element"
                                        required
                                        @focusout="handleFocusChange(game, 1)"
                                    />
                                    -
                                    <input
                                        v-model="game.awayScore"
                                        class="input-element"
                                        required
                                        @focusout="handleFocusChange(game, 2)"
                                    />
                                </div>
                            </div>
                            <div v-else class="p-2">
                                Oversidder: {{
                                    getPlayerNameById(game.players[0].playerId)
                                }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="clearfix">
                    <div class="float-left">
                        <button
                            type="button"
                            @click="goBack"
                            class="btn btn-pdl mt-3"
                        >
                            <i class="las la-arrow-left"></i> Ändra lag
                        </button>
                        <button
                            type="button"
                            @click="reset"
                            class="btn btn-pdl mt-3 ml-3"
                        >
                            <i class="las la-times"></i> Börja om
                        </button>
                    </div>
                    <div class="float-right">
                        <button type="submit" class="btn btn-pdl mt-3">
                            Beräkna resultat <i class="las la-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { PadelGame } from "@/models/padelGame.interface";
import { getFullPlayerNames } from "@/services/htmlHelperService";
import { evenScore, removeNotNumbers } from "@/services/scoreService";
import { GameSide } from "@/models/gameSide.enum";

export default defineComponent({
    methods: {
        onCalculateScore(): void {
            store.dispatch.americanoStore.updatePlayerScores();
            store.commit.americanoStore.INCREMENT_STEP();
        },
        IsNewRound(index: number, amountOfGames: number) {
            return index % (amountOfGames / 7) === 0;
        },
        getPlayerNames(game: PadelGame, side: GameSide) {
            return getFullPlayerNames(game, side);
        },
        shouldHaveTopBorder(game: PadelGame) {
            const lastTwoGamesOfFour = game.matchNumber == 2;
            const secondGameOfFour =
                game.playGroup == 2 && game.matchNumber == 1;
            return lastTwoGamesOfFour || secondGameOfFour;
        },
        goBack(): void {
            store.dispatch.americanoStore.sortPlayersById();
            store.commit.americanoStore.DECREMENT_STEP();
        },
        reset(): void {
            store.commit.americanoStore.RESET();
        },
        handleFocusChange(game: PadelGame, side: GameSide) {
            removeNotNumbers(
                game,
                side,
                store.getters.americanoStore.getRules.maxScore
            );
            evenScore(
                game,
                store.getters.americanoStore.getRules.maxScore,
                side
            );
            store.dispatch.americanoStore.saveStateManually();
        },
        getColorCodeGroup(game: PadelGame) {
            if (store.getters.americanoStore.getRules.colorCode === false) {
                return 0;
            }

            return game.playGroup;
        },
        isEven(index: number) {
            return index % 2 == 0;
        },
        getCourt(index: number) {
            const rules = this.getRules;
            if (rules.courtNames) return rules.courtNames[index];
            return "";
        },
        printCourt(index: number) {
            if (this.getRules.amountOfPlayers === 16) return "";

            if (this.isEven(index)) return this.getCourt(0) || "Bana 1";

            return this.getCourt(1) || "Bana 2";
        },
        getPlayerNameById(id: number) {
            const player = store.getters.americanoStore.getPlayers.find(
                (p: any) => p.id === id
            );
            return player ? player.name : "";
        },
    },
    computed: {
        getGames() {
            return store.getters.americanoStore.getGames;
        },
        getRules() {
            return store.getters.americanoStore.getRules;
        },
    },
});
</script>

<style>
.score-container {
    border-radius: 0.375rem;
    overflow: auto;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.score-round {
    background-color: var(--main-gray);
    text-align: left;
    color: white;
    padding: 0.4rem;
}

.game-container {
    padding: 0.2rem;
}

.team {
    font-weight: bold;
    color: var(--main-gray);
}

.vs {
    color: #e74c3c;
}

.vs-element {
    width: 150px;
}

.input-element {
    width: 35px;
    text-align: center;
}

.top-border {
    border-top: 0.1rem solid var(--main-gray);
}

.btn-pdl {
    color: #fff;
    background-color: var(--main-gray);
    border-color: var(--main-gray);
}

@media print {
    .top-border {
        border-top: 0.1rem solid transparent;
    }

    .score-round {
        border-bottom: 0.1rem solid var(--main-gray);
    }

    .score-round {
        color: var(--main-gray);
    }

    .btn-pdl {
        display: none;
    }
}
</style>
