<template>
    <div class="picker-overlay" @click.self="$emit('close')">
        <div class="picker-sheet">
            <div class="picker-handle"></div>
            <button class="picker-close" @click="$emit('close')" aria-label="Close">✕</button>

            <p class="picker-for">{{ $t('points_for') }}</p>
            <p class="picker-team">{{ activeTeamName }}</p>
            <p class="picker-other">{{ otherTeamName }} {{ $t('gets_the_rest') }}</p>

            <div class="picker-grid">
                <button
                    v-for="n in scoreOptions"
                    :key="n"
                    class="picker-circle"
                    :class="{ 'picker-circle--selected': n === currentScore }"
                    @click="pickScore(n)"
                    type="button"
                >{{ n }}</button>
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
        game:        { type: Object as PropType<PadelGame>,    required: true },
        scoringHome: { type: Boolean,                          required: true },
        maxScore:    { type: Number,                           required: true },
        players:     { type: Array as PropType<PadelPlayer[]>, required: true },
    },
    emits: ["score-set", "close"],
    computed: {
        scoreOptions(): number[] {
            return Array.from({ length: this.maxScore + 1 }, (_, i) => i);
        },
        homePlayers(): PadelPlayer[] {
            return this.game.players.filter(p => p.home)
                .map(p => this.players.find(pl => pl.id === p.playerId))
                .filter(Boolean) as PadelPlayer[];
        },
        awayPlayers(): PadelPlayer[] {
            return this.game.players.filter(p => !p.home)
                .map(p => this.players.find(pl => pl.id === p.playerId))
                .filter(Boolean) as PadelPlayer[];
        },
        activeTeamName(): string {
            return (this.scoringHome ? this.homePlayers : this.awayPlayers)
                .map(p => p.name).join(" & ");
        },
        otherTeamName(): string {
            return (this.scoringHome ? this.awayPlayers : this.homePlayers)
                .map(p => p.name).join(" & ");
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
.picker-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
}

.picker-sheet {
    background: var(--surface);
    border-radius: 24px 24px 0 0;
    padding: 0.5rem 1.5rem 3rem;
    width: 100%;
    max-width: 600px;
    position: relative;
    animation: slide-up 0.25s cubic-bezier(0.32,0.72,0,1);
}

@keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
}

.picker-handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--separator-opaque);
    margin: 0.6rem auto 1rem;
}

.picker-close {
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    background: rgba(118,118,128,0.12);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    color: var(--label-secondary);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.picker-for {
    text-align: center;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--label-secondary);
    margin: 0 0 0.1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.picker-team {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 0.2rem;
    color: var(--label);
}

.picker-other {
    text-align: center;
    font-size: 0.82rem;
    color: var(--label-secondary);
    margin: 0 0 1.2rem;
}

.picker-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.picker-circle {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 1.5px solid var(--separator-opaque);
    background: var(--bg);
    font-size: 1.15rem;
    font-weight: 600;
    cursor: pointer;
    color: var(--label);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s, background 0.12s;
    font-family: inherit;
}

.picker-circle:hover  { background: var(--surface-secondary); }
.picker-circle:active { transform: scale(0.90); }

.picker-circle--selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    box-shadow: 0 2px 12px rgba(0,122,255,0.35);
}

@media (min-width: 600px) {
    .picker-overlay { align-items: center; }
    .picker-sheet   { border-radius: 24px; padding-bottom: 2rem; max-width: 480px; }
}
</style>
