<template>
    <div class="match-wrapper">
        <div class="court">
            <div class="half left">
                <div class="player-name">{{ homeName }}</div>
                <div class="score-circle" @click="openOverlay('home')">
                    {{ homeScore === null ? "?" : homeScore }}
                </div>
            </div>
            <div class="net"></div>
            <div class="half right">
                <div class="player-name">{{ awayName }}</div>
                <div class="score-circle" @click="openOverlay('away')">
                    {{ awayScore === null ? "?" : awayScore }}
                </div>
            </div>
        </div>
    </div>
    <div class="overlay" v-if="overlayOpen">
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
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            homeName: "Hold A",
            awayName: "Hold B",
            maxPoints: 21,
            homeScore: null as number | null,
            awayScore: null as number | null,
            activeTeam: "" as "home" | "away" | "",
            overlayOpen: false,
        };
    },
    methods: {
        openOverlay(team: "home" | "away") {
            if (this.homeScore !== null || this.awayScore !== null) return;
            this.activeTeam = team;
            this.overlayOpen = true;
        },
        selectScore(score: number) {
            if (this.activeTeam === "home") {
                this.homeScore = score;
                this.awayScore = this.maxPoints - score;
            } else if (this.activeTeam === "away") {
                this.awayScore = score;
                this.homeScore = this.maxPoints - score;
            }
            this.overlayOpen = false;
        },
    },
});
</script>

<style scoped>
.match-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
}
.court {
    position: relative;
    width: 320px;
    height: 500px;
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
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--secondary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
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
