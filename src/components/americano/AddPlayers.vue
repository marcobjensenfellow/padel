<template>
    <div class="setup-page">

        <!-- ── Header + tournament name ───────────── -->
        <div class="setup-header">
            <h1>{{ $t('new_tournament') }}</h1>
            <div class="name-field">
                <input
                    class="name-input"
                    type="text"
                    list="tournamentNames"
                    v-model="tournamentNameRule"
                    @change="onTournamentChange"
                    :placeholder="$t('tournament_name_placeholder')"
                    required
                />
                <datalist id="tournamentNames">
                    <option v-for="name in tournamentNames" :key="name" :value="name" />
                </datalist>
            </div>
        </div>

        <form @submit.prevent="onAddPlayers">

            <!-- ── Game mode ───────────────────────── -->
            <p class="ios-section-header">{{ $t('game_format') }}</p>
            <div class="ios-section">
                <!-- Format -->
                <div class="ios-row justify-center">
                    <div class="seg-control mode-seg">
                        <button type="button" :class="{ 'seg-active': modeRule === 'Americano' }" @click="modeRule = 'Americano'">Americano</button>
                        <button type="button" :class="{ 'seg-active': modeRule === 'Mexicano' }" @click="modeRule = 'Mexicano'">Mexicano</button>
                    </div>
                </div>
                <!-- Americano: shuffle draw -->
                <div class="ios-row" v-if="modeRule === 'Americano'">
                    <span class="row-label">{{ $t('shuffle_draw') }}</span>
                    <label class="ios-toggle">
                        <input type="checkbox" v-model="randomScheduleRule" :disabled="getIsGamePrepared" />
                        <span class="ios-toggle-track"></span>
                    </label>
                </div>
                <!-- Mexicano: seeding -->
                <div class="ios-row" v-if="modeRule === 'Mexicano'">
                    <span class="row-label">{{ $t('seeding') }}</span>
                    <div class="seg-control seed-seg">
                        <button type="button" :class="{ 'seg-active': seedingModeRule === 'random' }" @click="seedingModeRule = 'random'">{{ $t('seeding_random') }}</button>
                        <button type="button" :class="{ 'seg-active': seedingModeRule === 'exact' }" @click="seedingModeRule = 'exact'">{{ $t('seeding_exact') }}</button>
                        <button type="button" :class="{ 'seg-active': seedingModeRule === 'category' }" @click="seedingModeRule = 'category'">{{ $t('seeding_category') }}</button>
                    </div>
                </div>
            </div>

            <!-- ── Rules ──────────────────────────── -->
            <p class="ios-section-header">{{ $t('rules') }}</p>
            <div class="ios-section">
                <!-- Points per round — stepper -->
                <div class="ios-row">
                    <span class="row-label">{{ $t('max_points_round') }}</span>
                    <div class="stepper">
                        <button type="button" class="stepper-btn" @click="stepMaxScore(-1)" :disabled="maxScore <= 1">−</button>
                        <span class="stepper-val">{{ maxScore }}</span>
                        <button type="button" class="stepper-btn" @click="stepMaxScore(1)">+</button>
                    </div>
                </div>
                <!-- Number of players — stepper -->
                <div class="ios-row">
                    <span class="row-label">{{ $t('number_of_players') }}</span>
                    <div class="stepper">
                        <button type="button" class="stepper-btn" @click="stepPlayers(-4)" :disabled="amountOfPlayersRule <= 4 || getIsGamePrepared">−</button>
                        <span class="stepper-val">{{ amountOfPlayersRule }}</span>
                        <button type="button" class="stepper-btn" @click="stepPlayers(4)" :disabled="amountOfPlayersRule >= 40 || getIsGamePrepared">+</button>
                    </div>
                </div>
                <!-- Court names -->
                <div class="ios-row court-names-row" v-if="numberOfCourts > 0">
                    <div class="court-names-grid">
                        <div v-for="index in numberOfCourts" :key="index" class="court-name-item">
                            <span class="court-name-label">{{ $t('court_label', { n: index }) }}</span>
                            <input
                                type="text"
                                class="ios-input court-name-input"
                                :placeholder="$t('court_label', { n: index })"
                                :value="courtNamesRule[index - 1]"
                                @input="updateCourtName(index - 1, ($event.target as HTMLInputElement).value)"
                            />
                        </div>
                    </div>
                </div>
                <!-- Prefer sides -->
                <div class="ios-row">
                    <span class="row-label">{{ $t('prefer_sides') }}</span>
                    <label class="ios-toggle">
                        <input type="checkbox" v-model="respectPreferredSidesRule" />
                        <span class="ios-toggle-track"></span>
                    </label>
                </div>
                <!-- Colour code (16 players) -->
                <div class="ios-row" v-if="amountOfPlayersRule === 16">
                    <span class="row-label">{{ $t('colour_code_groups') }}</span>
                    <label class="ios-toggle">
                        <input type="checkbox" v-model="colorCodeRule" />
                        <span class="ios-toggle-track"></span>
                    </label>
                </div>
            </div>

            <!-- ── Players ─────────────────────────── -->
            <div class="players-header-row">
                <p class="ios-section-header" style="margin:0">{{ $t('players') }}</p>
                <div class="player-quick-btns">
                    <button type="button" class="btn-pdl-ghost" @click="fillFunnyNames">{{ $t('autofill') }}</button>
                    <button type="button" class="btn-pdl-ghost" @click="fillDemoNinePlayers">{{ $t('demo') }}</button>
                </div>
            </div>
            <div
                class="ios-section player-list"
                ref="playerList"
            >
                <div
                    v-for="(player, index) in getPlayers"
                    :key="player.id"
                    class="ios-row player-row"
                    :class="{
                        'is-first': getColorCodeGroup(player) === 1,
                        'is-second': getColorCodeGroup(player) === 2,
                        'drag-over': dragOverIndex === index,
                    }"
                    :draggable="isMexicano && seedingModeRule === 'exact'"
                    @dragstart="onDragStart(index)"
                    @dragover.prevent="onDragOver(index)"
                    @drop="onDrop(index)"
                    @dragend="onDragEnd"
                >
                    <!-- Seed number (Mexicano exact mode only) -->
                    <span v-if="isMexicano && seedingModeRule === 'exact'" class="seed-badge">{{ index + 1 }}</span>

                    <!-- Name input -->
                    <input
                        type="text"
                        class="ios-input player-name"
                        :placeholder="$t('player_n', { n: index + 1 })"
                        v-model="player.name"
                        @keyup="handlePlayerNameChange"
                        :class="{ 'name-invalid': isDuplicateName(player.id) }"
                        required
                    />

                    <!-- Side segmented control (only when respectPreferredSides is on) -->
                    <div v-if="respectPreferredSidesRule" class="seg-control side-seg">
                        <button type="button"
                            :class="{ 'seg-active': player.preferredSide === 'Left' }"
                            @click="player.preferredSide = 'Left'"
                            title="Prefers left side">L</button>
                        <button type="button"
                            :class="{ 'seg-active': player.preferredSide === 'Both' }"
                            @click="player.preferredSide = 'Both'"
                            title="No preference">–</button>
                        <button type="button"
                            :class="{ 'seg-active': player.preferredSide === 'Right' }"
                            @click="player.preferredSide = 'Right'"
                            title="Prefers right side">R</button>
                    </div>

                    <!-- Category pills (Mexicano + category mode) -->
                    <div v-if="isMexicano && seedingModeRule === 'category'" class="cat-seg">
                        <button
                            v-for="(_, ci) in numCategories"
                            :key="ci"
                            type="button"
                            class="cat-btn"
                            :class="{ 'cat-btn--active': (player.seedCategory ?? 0) === ci }"
                            @click="setCategoryForPlayer(player, ci)"
                        >{{ categoryLabel(ci) }}</button>
                    </div>

                    <!-- Drag handle (Mexicano exact mode only) -->
                    <span v-if="isMexicano && seedingModeRule === 'exact'" class="drag-handle">⠿</span>
                </div>
            </div>
            <p v-if="duplicateNameIds.length > 0" class="error-text">{{ $t('duplicate_names_error') }}</p>
            <p v-if="maxScoreInvalid" class="error-text">{{ $t('max_score_error') }}</p>

            <!-- ── Actions ──────────────────────────── -->
            <div class="action-row">
                <button type="button" @click="reset" class="btn-pdl-secondary">{{ $t('reset') }}</button>
                <button type="submit" class="btn-pdl">
                    {{ getAddPlayerText }} →
                </button>
            </div>

        </form>
    </div>
</template>

<script lang="ts">
import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";
import { PadelRules, SeedingMode } from "@/models/padelRules.interface";
import { getColorCodeGroupFromPlayer } from "@/services/americanoService";
import { numCategoriesForPlayers } from "@/services/mexicanoService";
import { getDuplicateIds, isValidMaxScore } from "@/services/htmlHelperService";
import store from "@/store/index";
import { defineComponent } from "vue";
import { getTournamentNames } from "@/services/storageService";

export default defineComponent({
    data() {
        return {
            maxScore: 24 as number,
            maxScoreInvalid: false,
            duplicateNameIds: [] as number[],
            dragIndex: null as number | null,
            dragOverIndex: null as number | null,
        };
    },
    created() {
        this.$data.maxScore = store.getters.americanoStore.getRules.maxScore;
    },
    computed: {
        isMexicano(): boolean {
            return store.getters.americanoStore.getRules.mode === "Mexicano";
        },
        getPlayers() {
            return store.getters.americanoStore.getPlayers;
        },
        getIsGamePrepared() {
            return store.getters.americanoStore.getIsGamePrepared;
        },
        getAddPlayerText() {
            return store.getters.americanoStore.getIsGamePrepared
                ? this.$t("go_to_matches")
                : this.$t("start_tournament");
        },
        modeRule: {
            get() { return store.getters.americanoStore.getRules.mode; },
            set(value: string) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    mode: value as any,
                });
            },
        },
        randomScheduleRule: {
            get() { return store.getters.americanoStore.getRules.randomSchedule; },
            set(value: boolean) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    randomSchedule: value,
                });
            },
        },
        amountOfPlayersRule: {
            get() { return store.getters.americanoStore.getRules.amountOfPlayers; },
            set(amount: number) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    amountOfPlayers: amount,
                    colorCode: amount === 16 ? this.colorCodeRule : false,
                });
            },
        },
        colorCodeRule: {
            get() { return store.getters.americanoStore.getRules.colorCode; },
            set(value: boolean) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    colorCode: value,
                });
            },
        },
        seedingModeRule: {
            get(): SeedingMode { return store.getters.americanoStore.getRules.seedingMode ?? "exact"; },
            set(value: SeedingMode) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    seedingMode: value,
                });
            },
        },
        respectPreferredSidesRule: {
            get(): boolean { return store.getters.americanoStore.getRules.respectPreferredSides ?? false; },
            set(value: boolean) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    respectPreferredSides: value,
                });
            },
        },
        numCategories(): number[] {
            const n = numCategoriesForPlayers(this.amountOfPlayersRule);
            return Array.from({ length: n }, (_, i) => i);
        },
        courtNamesRule: {
            get() { return store.getters.americanoStore.getRules.courtNames; },
            set(value: string[]) {
                store.commit.americanoStore.SET_RULES({
                    ...store.getters.americanoStore.getRules,
                    courtNames: value,
                });
            },
        },
        tournamentNameRule: {
            get() { return store.getters.americanoStore.getTournamentName; },
            set(value: string) { store.commit.americanoStore.SET_TOURNAMENT_NAME(value); },
        },
        tournamentNames() { return getTournamentNames(); },
        numberOfCourts() {
            return Math.floor(this.amountOfPlayersRule / 4);
        },
    },
    methods: {
        onAddPlayers() {
            if (this.maxScoreInvalid) return;
            const duplicateIds = getDuplicateIds(this.getPlayers);
            if (duplicateIds.length > 0) {
                this.$data.duplicateNameIds = duplicateIds;
                return;
            }
            if (!store.getters.americanoStore.getIsGamePrepared) {
                store.dispatch.americanoStore.prepareGames();
            }
            store.commit.americanoStore.INCREMENT_STEP();
        },
        reset() {
            store.commit.americanoStore.RESET();
            this.$data.duplicateNameIds = [];
            this.$data.maxScoreInvalid = false;
            this.$data.maxScore = 24;
        },
        onMaxScoreChange() {
            if (!isValidMaxScore(this.$data.maxScore)) {
                this.maxScoreInvalid = true;
                return;
            }
            this.maxScoreInvalid = false;
            store.commit.americanoStore.SET_RULES({
                ...store.getters.americanoStore.getRules,
                maxScore: Number(this.$data.maxScore),
            });
        },
        stepMaxScore(delta: number) {
            const next = Math.max(1, this.$data.maxScore + delta);
            this.$data.maxScore = next;
            this.maxScoreInvalid = false;
            store.commit.americanoStore.SET_RULES({
                ...store.getters.americanoStore.getRules,
                maxScore: next,
            });
        },
        stepPlayers(delta: number) {
            // Keep values as multiples of 4, step in increments of 4
            const current = Math.round(this.amountOfPlayersRule / 4) * 4;
            const next = Math.min(40, Math.max(4, current + delta));
            this.amountOfPlayersRule = next;
            this.handleAmountOfPlayersChange();
        },
        handlePlayerNameChange() {
            this.$data.duplicateNameIds = getDuplicateIds(this.getPlayers);
            store.dispatch.americanoStore.saveStateManually();
        },
        handleAmountOfPlayersChange() {
            const current = [...this.getPlayers];
            const target = this.amountOfPlayersRule;
            let players = [...current];
            if (target > current.length) {
                for (let i = current.length; i < target; i++) {
                    players.push({ name: "", score: 0, id: i + 1, preferredSide: "Both", seed: i + 1, seedCategory: 0 });
                }
            } else {
                players = players.slice(0, target);
            }
            store.commit.americanoStore.UPDATE_PLAYERS(players);
        },
        updateCourtName(index: number, name: string) {
            const courts = [...this.courtNamesRule];
            courts[index] = name;
            store.commit.americanoStore.SET_RULES({
                ...store.getters.americanoStore.getRules,
                courtNames: courts,
            });
        },
        onTournamentChange() {
            const name = this.tournamentNameRule as string;
            if (getTournamentNames().includes(name)) {
                store.commit.americanoStore.LOAD_STATE(name);
            } else {
                store.commit.americanoStore.RESET();
                store.commit.americanoStore.SET_TOURNAMENT_NAME(name);
            }
        },
        isDuplicateName(id: number) {
            return this.$data.duplicateNameIds.includes(id);
        },
        getColorCodeGroup(player: PadelPlayer) {
            if (!store.getters.americanoStore.getRules.colorCode) return 0;
            if (!store.getters.americanoStore.getIsGamePrepared) {
                return store.getters.americanoStore.getPlayers.indexOf(player) <= 7 ? 1 : 2;
            }
            return getColorCodeGroupFromPlayer(
                player,
                store.getters.americanoStore.getPlayers,
                store.getters.americanoStore.getGames
            );
        },
        /* ── Category seeding ── */
        categoryLabel(catIndex: number): string {
            const n = numCategoriesForPlayers(this.amountOfPlayersRule);
            return this.$t(`cat_${catIndex}_of_${n}`);
        },
        setCategoryForPlayer(player: PadelPlayer, catIndex: number) {
            const updated = [...this.getPlayers];
            const idx = updated.findIndex(p => p.id === player.id);
            if (idx !== -1) updated[idx] = { ...updated[idx], seedCategory: catIndex };
            store.commit.americanoStore.UPDATE_PLAYERS(updated);
        },
        /* ── Drag to reorder (Mexicano exact seeding) ── */
        onDragStart(index: number) {
            this.$data.dragIndex = index;
        },
        onDragOver(index: number) {
            this.$data.dragOverIndex = index;
        },
        onDrop(index: number) {
            if (this.$data.dragIndex === null) return;
            const updated = [...this.getPlayers];
            const [moved] = updated.splice(this.$data.dragIndex, 1);
            updated.splice(index, 0, moved);
            updated.forEach((p, i) => (p.seed = i + 1));
            store.commit.americanoStore.UPDATE_PLAYERS(updated);
            this.$data.dragIndex = null;
            this.$data.dragOverIndex = null;
        },
        onDragEnd() {
            this.$data.dragIndex = null;
            this.$data.dragOverIndex = null;
        },
        /* ── Demo data ─────────────────────────── */
        fillFunnyNames() {
            const names = ["Rocket Racquet","Paddle Pop","Lobster","Serve-ius Snape",
                "Smash Potato","Slice Slice Baby","Rally Belly","Ace Ventura",
                "Court Jester","Spin Doctor","Net Ninja","Paddle Pusher",
                "Faulty Tower","Drop Shot","Lob Machine","Game of Throws"];
            const players = [...this.getPlayers];
            players.forEach((p, i) => { p.name = names[i % names.length]; });
            store.commit.americanoStore.UPDATE_PLAYERS(players);
        },
        fillDemoNinePlayers() {
            const demo = [
                { name: "Mathias",          side: "Both"  },
                { name: "Carl Emil",        side: "Both"  },
                { name: "Christian",        side: "Both"  },
                { name: "Thomas",           side: "Both"  },
                { name: "Daniel",           side: "Both"  },
                { name: "Marco",            side: "Right" },
                { name: "Jakob",            side: "Right" },
                { name: "Brian",            side: "Left"  },
                { name: "Mads",             side: "Left"  },
            ];
            const players: PadelPlayer[] = demo.map((p, i) => ({
                name: p.name, score: 0, id: i + 1,
                preferredSide: p.side as PreferredSide, seed: i + 1, seedCategory: 0,
            }));
            store.commit.americanoStore.UPDATE_PLAYERS(players);
            store.commit.americanoStore.SET_RULES({
                ...store.getters.americanoStore.getRules,
                amountOfPlayers: players.length,
            });
        },
    },
    watch: {
        getPlayers: { handler() { store.dispatch.americanoStore.saveStateManually(); }, deep: true },
        getRules:   { handler() { store.dispatch.americanoStore.saveStateManually(); }, deep: true },
        tournamentNameRule() { store.dispatch.americanoStore.saveStateManually(); },
    },
});
</script>

<style scoped>
.setup-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.2rem 1rem 3rem;
}

.setup-header {
    padding: 0.8rem 0 0.4rem;
}

.setup-header h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
}

/* Tournament name input — integrated into header */
.name-field {
    margin: 0.7rem 0 0.2rem;
}
.name-input {
    width: 100%;
    font-size: 1.05rem;
    font-weight: 500;
    text-align: center;
    border: none;
    border-bottom: 1.5px solid var(--separator);
    border-radius: 0;
    padding: 0.45rem 0;
    background: transparent;
    color: var(--label-primary);
    font-family: inherit;
}
.name-input:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
}
.name-input::placeholder { color: var(--label-tertiary); }

/* Row layout */
.ios-row { min-height: 48px; }

.row-label {
    flex: 1;
    font-size: 0.97rem;
}

.row-value {
    display: flex;
    align-items: center;
}

.row-value-input {
    text-align: right;
    color: var(--label-secondary);
    max-width: 180px;
}

.text-right { text-align: right; }

.justify-center { justify-content: center; padding: 0.6rem 1rem; }

/* Mode segmented control */
.mode-seg { width: 100%; }
.mode-seg button { flex: 1; padding: 5px 0; font-size: 0.9rem; }

/* Seeding 3-way segmented control */
.seed-seg { flex-shrink: 0; }
.seed-seg button { padding: 4px 10px; font-size: 0.8rem; }

/* Stepper (+/-) */
.stepper {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--bg);
    border-radius: 10px;
    border: 1px solid var(--separator);
    overflow: hidden;
}
.stepper-btn {
    width: 34px;
    height: 32px;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1;
    border: none;
    background: transparent;
    color: var(--primary-color);
    cursor: pointer;
    transition: background 0.12s;
}
.stepper-btn:active { background: rgba(0,0,0,0.06); }
.stepper-btn:disabled { color: var(--label-tertiary); cursor: default; }
.stepper-val {
    min-width: 36px;
    text-align: center;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--label-primary);
    border-left: 1px solid var(--separator);
    border-right: 1px solid var(--separator);
    padding: 0 4px;
    line-height: 32px;
}

/* Side segmented control */
.side-seg { flex-shrink: 0; }
.side-seg button { padding: 4px 8px; font-size: 0.78rem; font-weight: 700; min-width: 26px; }

/* Category pills */
.cat-seg {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}
.cat-btn {
    padding: 3px 8px;
    font-size: 0.72rem;
    font-weight: 600;
    border-radius: 20px;
    border: 1.5px solid var(--separator);
    background: var(--bg);
    color: var(--label-secondary);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.cat-btn--active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
}

/* iOS Toggle switch */
.ios-toggle { position: relative; display: inline-block; cursor: pointer; }
.ios-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.ios-toggle-track {
    display: block;
    width: 51px; height: 31px;
    background: #E5E5EA;
    border-radius: 31px;
    transition: background 0.2s;
    position: relative;
}
.ios-toggle-track::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px;
    width: 27px; height: 27px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.ios-toggle input:checked + .ios-toggle-track { background: var(--primary-color); }
.ios-toggle input:checked + .ios-toggle-track::after { transform: translateX(20px); }

/* Players section */
.players-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1.4rem 0 0.35rem;
}

.player-quick-btns {
    display: flex;
    gap: 0;
}

.player-list { user-select: none; }

.player-row { gap: 0.5rem; cursor: default; }
.player-row[draggable="true"] { cursor: grab; }
.player-row.drag-over { background: rgba(0,122,255,0.06); }

.seed-badge {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-name {
    flex: 1;
    min-width: 0;
    font-size: 0.97rem;
}

.name-invalid { color: var(--destructive-color) !important; }

.drag-handle {
    color: var(--label-tertiary);
    font-size: 1.1rem;
    cursor: grab;
    flex-shrink: 0;
    padding: 0 2px;
}

/* Court names */
.court-names-row { flex-direction: column; align-items: flex-start; }
.court-names-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
}
.court-name-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--bg);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.7rem;
    flex: 1;
    min-width: 120px;
}
.court-name-label { font-size: 0.78rem; color: var(--label-secondary); white-space: nowrap; }
.court-name-input { font-size: 0.9rem; }

/* Error */
.error-text {
    font-size: 0.82rem;
    color: var(--destructive-color);
    padding: 0.3rem 0.2rem;
    margin: 0;
}

/* Actions */
.action-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
}
</style>
