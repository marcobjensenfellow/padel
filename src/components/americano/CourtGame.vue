<template>
    <div
        class="court-container"
        :class="{
            'is-second': game.playGroup === 2,
            'is-first': game.playGroup === 1,
        }"
    >
        <div class="team left">{{ getPlayerNames(game, GameSide.Home) }}</div>
        <div class="score-select">
            <div class="circle" @click="selectScore(GameSide.Home)">
                <span v-if="game.homeScore === null">?</span>
                <span v-else>{{ game.homeScore }}</span>
            </div>
            <div class="circle" @click="selectScore(GameSide.Away)">
                <span v-if="game.awayScore === null">?</span>
                <span v-else>{{ game.awayScore }}</span>
            </div>
        </div>
        <div class="team right">{{ getPlayerNames(game, GameSide.Away) }}</div>

        <div v-if="activeSide !== null" class="score-popup">
            <button
                v-for="n in maxScore + 1"
                :key="n - 1"
                @click="setScore(n - 1)"
            >
                {{ n - 1 }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable vue/no-mutating-props */
import { defineComponent, PropType } from "vue";
import { PadelGame } from "@/models/padelGame.interface";
import { GameSide } from "@/models/gameSide.enum";
import { getFullPlayerNames } from "@/services/htmlHelperService";
import { evenScore, removeNotNumbers } from "@/services/scoreService";
import store from "@/store/index";

export default defineComponent({
    props: {
        game: {
            type: Object as PropType<PadelGame>,
            required: true,
        },
    },
    data() {
        return {
            activeSide: null as GameSide | null,
        };
    },
    computed: {
        maxScore() {
            return store.getters.americanoStore.getRules.maxScore;
        },
    },
    methods: {
        getPlayerNames(game: PadelGame, side: GameSide) {
            return getFullPlayerNames(game, side);
        },
        selectScore(side: GameSide) {
            this.activeSide = side;
        },
        setScore(value: number) {
            if (this.activeSide === GameSide.Home) {
                this.game.homeScore = value;
            } else if (this.activeSide === GameSide.Away) {
                this.game.awayScore = value;
            }
            if (this.activeSide !== null) {
                removeNotNumbers(this.game, this.activeSide, this.maxScore);
                evenScore(this.game, this.maxScore, this.activeSide);
                store.dispatch.americanoStore.saveStateManually();
            }
            this.activeSide = null;
        },
    },
    components: {},
});
</script>

<style scoped>
.court-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--light-color);
    padding: 0.5rem;
    border: 1px solid var(--primary-color);
    border-radius: 0.375rem;
    margin-bottom: 1rem;
}
.team {
    width: 40%;
    text-align: center;
    font-weight: bold;
}
.score-select {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.circle {
    width: 40px;
    height: 40px;
    margin: 2px 0;
    background-color: var(--secondary-color);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.score-popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid var(--primary-color);
    padding: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    z-index: 10;
}
.score-popup button {
    border: none;
    background-color: var(--secondary-color);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
}
</style>
