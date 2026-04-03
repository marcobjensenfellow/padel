<template>
    <div class="score-picker-overlay" @click.self="$emit('close')">
        <div class="score-picker-sheet">
            <button class="score-picker-close" @click="$emit('close')" aria-label="Close">✕</button>
            <p class="score-picker-title">
                Points for <strong>{{ activeTeamName }}</strong>
            </p>
            <p class="score-picker-subtitle">
                ({{ otherTeamName }} gets the rest)
            </p>
            <div class="score-picker-grid">
                <button
                    v-for="n in scoreOptions"
                    :key="n"
                    class="score-circle"
                    :class="{ 'score-circle--selected': n === currentScore }"
                    @click="pickScore(n)"
                >
                    {{ n }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";

export default defineComponent({
    name: "ScorePicker",
    props: {
        game: {
            type: Object as PropType<PadelGame>,
            required: true,
        },
        /** true = we are scoring the HOME team, false = AWAY team */
        scoringHome: {
            type: Boolean,
            required: true,
        },
        maxScore: {
            type: Number,
            required: true,
        },
        players: {
            type: Array as PropType<PadelPlayer[]>,
            required: true,
        },
    },
    emits: ["score-set", "close"],
    computed: {
        scoreOptions(): number[] {
            const opts: number[] = [];
            for (let i = 0; i <= this.maxScore; i++) opts.push(i);
            return opts;
        },
        homePlayers(): PadelPlayer[] {
            return this.game.players
                .filter(p => p.home)
                .map(p => this.players.find(pl => pl.id === p.playerId))
                .filter(Boolean) as PadelPlayer[];
        },
        awayPlayers(): PadelPlayer[] {
            return this.game.players
                .filter(p => !p.home)
                .map(p => this.players.find(pl => pl.id === p.playerId))
                .filter(Boolean) as PadelPlayer[];
        },
        activeTeamName(): string {
            const team = this.scoringHome ? this.homePlayers : this.awayPlayers;
            return team.map(p => p.name).join(" & ");
        },
        otherTeamName(): string {
            const team = this.scoringHome ? this.awayPlayers : this.homePlayers;
            return team.map(p => p.name).join(" & ");
        },
        currentScore(): number | null {
            return this.scoringHome ? this.game.homeScore : this.game.awayScore;
        },
    },
    methods: {
        pickScore(score: number) {
            this.$emit("score-set", {
                game: this.game,
                homeScore: this.scoringHome ? score : this.maxScore - score,
                awayScore: this.scoringHome ? this.maxScore - score : score,
            });
        },
    },
});
</script>

<style scoped>
.score-picker-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
}

.score-picker-sheet {
    background: #fff;
    border-radius: 20px 20px 0 0;
    padding: 1.5rem 1.5rem 2.5rem;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.2);
    position: relative;
    animation: slide-up 0.22s ease-out;
}

@keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
}

.score-picker-close {
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: #888;
    line-height: 1;
    padding: 0;
}

.score-picker-title {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 0.1rem;
    color: #2f3640;
}

.score-picker-subtitle {
    text-align: center;
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 1rem;
}

.score-picker-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
}

.score-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid #ddd;
    background: #f5f5f5;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s, border-color 0.12s, transform 0.1s;
    color: #2f3640;
}

.score-circle:hover {
    background: #e0e0e0;
    border-color: #bbb;
}

.score-circle:active {
    transform: scale(0.93);
}

.score-circle--selected {
    background: var(--primary-color, #3b82f6);
    border-color: var(--primary-color, #3b82f6);
    color: #fff;
}

@media (min-width: 600px) {
    .score-picker-overlay {
        align-items: center;
    }
    .score-picker-sheet {
        border-radius: 20px;
        max-width: 520px;
        padding-bottom: 2rem;
    }
}
</style>
