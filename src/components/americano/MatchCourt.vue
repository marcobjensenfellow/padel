<template>
    <div class="match-wrapper">
        <div class="court">
            <div class="half left">
                <div class="player-name">{{ homeName }}</div>
                <div class="score-circle" @click="openOverlay('home')">
                    {{ game.homeScore === null ? "?" : game.homeScore }}
                </div>
            </div>
            <div class="net"></div>
            <div class="half right">
                <div class="player-name">{{ awayName }}</div>
                <div class="score-circle" @click="openOverlay('away')">
                    {{ game.awayScore === null ? "?" : game.awayScore }}
                </div>
            </div>
        </div>
    </div>
    <div class="overlay" v-if="overlayOpen" @click.self="overlayOpen = false">
        <div class="grid">
            <button
                v-for="n in maxPoints + 1"
                :key="n"
                class="grid-btn"
                @click="selectScore(n - 1)"
            >
                {{ n - 1 }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PadelGame } from "@/models/padelGame.interface";
import store from "@/store/index";

export default defineComponent({
    emits: ["set-score"],
    props: {
        game: {
            type: Object as PropType<PadelGame>,
            required: true,
        },
        homeName: {
            type: String,
            required: true,
        },
        awayName: {
            type: String,
            required: true,
        },
        maxPoints: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            overlayOpen: false,
            activeTeam: "" as "home" | "away" | "",
        };
    },
    methods: {
        openOverlay(team: "home" | "away") {
            if (this.game.homeScore !== null || this.game.awayScore !== null)
                return;
            this.activeTeam = team;
            this.overlayOpen = true;
        },
        selectScore(score: number) {
            if (this.activeTeam === "home") {
                const homeScore = score;
                const awayScore = this.maxPoints - score;
                this.$emit("set-score", {
                    game: this.game,
                    homeScore,
                    awayScore,
                });
            } else if (this.activeTeam === "away") {
                const awayScore = score;
                const homeScore = this.maxPoints - score;
                this.$emit("set-score", {
                    game: this.game,
                    homeScore,
                    awayScore,
                });
            }
            this.overlayOpen = false;
            store.dispatch.americanoStore.saveStateManually();
        },
    },
});
</script>

<style scoped>
.match-wrapper {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}
.court {
    position: relative;
    width: 320px;
    height: 160px;
    background: #d2b48c;
    border: 4px solid #ffffff;
}
.half {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.left {
    left: 0;
    border-right: 2px solid #ffffff;
}
.right {
    right: 0;
    border-left: 2px solid #ffffff;
}
.net {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 3px;
    background: #ffffff;
    transform: translateY(-50%);
}
.player-name {
    position: absolute;
    top: 10px;
    font-weight: bold;
    color: var(--dark-color);
}
.score-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--secondary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: #fff;
    cursor: pointer;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}
.grid {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(6, 50px);
    gap: 0.5rem;
}
.grid-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: var(--accent-color);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}
</style>
