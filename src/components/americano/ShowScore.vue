<template>
    <div class="score-page">

        <!-- Header -->
        <div class="score-header">
            <h1>{{ $t('standings') }}</h1>
            <p class="score-subtitle" v-if="isMexicano">
                {{ $t('round_of', { current: currentRound, total: totalRoundsCount }) }}
            </p>
            <p class="score-subtitle" v-else>
                {{ isFullyComplete ? $t('final_standings') : $t('current_standings') }}
            </p>
        </div>

        <!-- Single table -->
        <div v-if="!showTwoTables" class="ios-section standings-table">
            <div
                v-for="(player, index) in getAllPlayers()"
                :key="player.id"
                class="standing-row"
                :class="{
                    'standing-row--gold':   index === 0,
                    'standing-row--silver': index === 1,
                    'standing-row--bronze': index === 2,
                    'is-first':  getColorCodeGroup(player) === 1,
                    'is-second': getColorCodeGroup(player) === 2,
                }"
            >
                <span class="standing-rank">
                    <span v-if="index === 0">🥇</span>
                    <span v-else-if="index === 1">🥈</span>
                    <span v-else-if="index === 2">🥉</span>
                    <span v-else class="rank-num">{{ index + 1 }}</span>
                </span>
                <span class="standing-name">{{ player.name }}</span>
                <span class="standing-score">{{ player.score }}</span>
            </div>
        </div>

        <!-- Two-group tables (16 players) -->
        <div v-if="showTwoTables" class="two-tables">
            <div>
                <p class="ios-section-header">{{ $t('group_a') }}</p>
                <div class="ios-section standings-table">
                    <div
                        v-for="(player, index) in getFirstGroup()"
                        :key="player.id"
                        class="standing-row"
                        :class="{ 'standing-row--gold': index === 0, 'is-first': true }"
                    >
                        <span class="standing-rank">
                            <span v-if="index === 0">🥇</span>
                            <span v-else class="rank-num">{{ index + 1 }}</span>
                        </span>
                        <span class="standing-name">{{ player.name }}</span>
                        <span class="standing-score">{{ player.score }}</span>
                    </div>
                </div>
            </div>
            <div>
                <p class="ios-section-header">{{ $t('group_b') }}</p>
                <div class="ios-section standings-table">
                    <div
                        v-for="(player, index) in getSecondGroup()"
                        :key="player.id"
                        class="standing-row"
                        :class="{ 'standing-row--gold': index === 0, 'is-second': true }"
                    >
                        <span class="standing-rank">
                            <span v-if="index === 0">🥇</span>
                            <span v-else class="rank-num">{{ index + 1 }}</span>
                        </span>
                        <span class="standing-name">{{ player.name }}</span>
                        <span class="standing-score">{{ player.score }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Change grouping toggle -->
        <div class="grouping-toggle" v-if="hasTwoGroups">
            <button class="btn-pdl-ghost" @click="showTwoTables = !showTwoTables">
                {{ showTwoTables ? $t('show_combined') : $t('show_by_group') }}
            </button>
        </div>

        <!-- Actions — clear hierarchy -->
        <div class="score-actions">
            <!-- Primary: next round OR new tournament -->
            <button
                v-if="hasMoreRounds"
                @click="nextRound"
                class="btn-pdl btn-primary-full"
            >
                {{ $t('next_round') }}
            </button>
            <button
                v-else
                @click="newGame"
                class="btn-pdl btn-primary-full"
            >
                {{ $t('new_tournament') }}
            </button>

            <!-- Secondary: back to matches / mid-tournament end -->
            <div class="score-actions-secondary">
                <button @click="goBack" class="btn-pdl-ghost">
                    {{ $t('back_to_matches') }}
                </button>
                <button
                    v-if="hasMoreRounds"
                    @click="confirmEnd = true"
                    class="btn-pdl-ghost btn-danger-ghost"
                >
                    {{ $t('end_early') }}
                </button>
            </div>
        </div>

        <!-- End early confirm -->
        <div v-if="confirmEnd" class="confirm-overlay" @click.self="confirmEnd = false">
            <div class="confirm-sheet">
                <p class="confirm-icon">⚠️</p>
                <h3>{{ $t('end_early_title') }}</h3>
                <p class="confirm-body">
                    {{ $t(roundsRemaining === 1 ? 'round_remaining' : 'rounds_remaining', { n: roundsRemaining }) }}
                </p>
                <button class="btn-pdl btn-destructive" @click="endEarly">{{ $t('yes_end') }}</button>
                <button class="btn-pdl-ghost" @click="confirmEnd = false">{{ $t('keep_playing') }}</button>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { PadelPlayer } from "@/models/padelPlayer.interface";
import {
    getColorCodeGroupFromPlayer,
    getMaxRound,
} from "@/services/americanoService";
import { sortByScore } from "@/services/scoreService";
import store from "@/store/index";
import { defineComponent } from "vue";
import { totalRounds } from "@/services/mexicanoService";

export default defineComponent({
    data() {
        return {
            hasTwoGroups: false,
            showTwoTables: false,
            confirmEnd: false,
        };
    },
    computed: {
        isMexicano(): boolean {
            return store.getters.americanoStore.getRules.mode === "Mexicano";
        },
        currentRound(): number {
            return store.getters.americanoStore.getRound;
        },
        totalRoundsCount(): number {
            return totalRounds(store.getters.americanoStore.getPlayers.length);
        },
        isFullyComplete(): boolean {
            return !this.hasMoreRounds;
        },
        hasMoreRounds(): boolean {
            const rules = store.getters.americanoStore.getRules;
            if (rules.mode === "Mexicano") {
                return store.getters.americanoStore.getRound <
                    totalRounds(store.getters.americanoStore.getPlayers.length);
            }
            const games = store.getters.americanoStore.getGames;
            const maxRound = getMaxRound(games);
            const played = Math.max(0, ...games
                .filter((g: any) => g.homeScore !== null || g.awayScore !== null)
                .map((g: any) => g.round));
            return played < maxRound;
        },
        roundsRemaining(): number {
            if (this.isMexicano) {
                return this.totalRoundsCount - this.currentRound;
            }
            const games = store.getters.americanoStore.getGames;
            const maxRound = getMaxRound(games);
            const played = Math.max(0, ...games
                .filter((g: any) => g.homeScore !== null || g.awayScore !== null)
                .map((g: any) => g.round));
            return maxRound - played;
        },
    },
    methods: {
        goBack() {
            store.commit.americanoStore.DECREMENT_STEP();
        },
        newGame() {
            store.dispatch.americanoStore.newGame();
        },
        nextRound() {
            store.dispatch.americanoStore.nextRound();
        },
        endEarly() {
            store.dispatch.americanoStore.newGame();
        },
        getColorCodeGroup(player: PadelPlayer) {
            if (!store.getters.americanoStore.getRules.colorCode) return 0;
            return getColorCodeGroupFromPlayer(
                player,
                store.getters.americanoStore.getPlayers,
                store.getters.americanoStore.getGames
            );
        },
        getAllPlayers() {
            const players = store.getters.americanoStore.getPlayers;
            if (players.length === 16) this.$data.hasTwoGroups = true;
            return sortByScore([...players]);
        },
        getFirstGroup() {
            return store.getters.americanoStore.getPlayers
                .filter((p: PadelPlayer) => getColorCodeGroupFromPlayer(
                    p,
                    store.getters.americanoStore.getPlayers,
                    store.getters.americanoStore.getGames
                ) === 1);
        },
        getSecondGroup() {
            return store.getters.americanoStore.getPlayers
                .filter((p: PadelPlayer) => getColorCodeGroupFromPlayer(
                    p,
                    store.getters.americanoStore.getPlayers,
                    store.getters.americanoStore.getGames
                ) === 2);
        },
    },
});
</script>

<style scoped>
.score-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.2rem 1rem 4rem;
}

.score-header { margin-bottom: 1.2rem; }
.score-header h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; margin: 0; }
.score-subtitle { margin: 0.1rem 0 0; color: var(--label-secondary); font-size: 0.9rem; }

/* Standings table */
.standings-table { margin-bottom: 0.5rem; }

.standing-row {
    display: flex;
    align-items: center;
    padding: 0.85rem 1rem;
    gap: 0.75rem;
    position: relative;
}

.standing-row + .standing-row::before {
    content: '';
    position: absolute;
    top: 0; left: 1rem; right: 0;
    height: 1px;
    background: var(--separator);
}

.standing-rank {
    width: 32px;
    text-align: center;
    font-size: 1.15rem;
    flex-shrink: 0;
}

.rank-num {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--label-secondary);
}

.standing-name {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
}

.standing-score {
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--primary-color);
}

.standing-row--gold   .standing-name { font-weight: 700; }
.standing-row--silver .standing-name { font-weight: 600; }

.two-tables { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
@media (max-width: 500px) { .two-tables { grid-template-columns: 1fr; } }

.grouping-toggle { text-align: center; margin: 0.5rem 0; }

/* Actions */
.score-actions { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }

.btn-primary-full {
    width: 100%;
    padding: 1rem;
    font-size: 1.05rem;
    border-radius: var(--radius-lg);
}

.score-actions-secondary {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-danger-ghost { color: var(--destructive-color) !important; }

/* Confirm overlay */
.confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
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

.btn-destructive { background: var(--destructive-color) !important; width: 100%; padding: 0.9rem; border-radius: var(--radius-lg); }

@keyframes slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
}

@media (min-width: 600px) {
    .confirm-overlay { align-items: center; }
    .confirm-sheet   { border-radius: 24px; max-width: 400px; padding-bottom: 2rem; }
}
</style>
