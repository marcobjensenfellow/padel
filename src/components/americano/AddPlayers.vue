<template>
    <div>
        <h1 class="text-center">Setup</h1>
        <form @submit.prevent="onAddPlayers">
            <div class="row">
                <div class="col-12 col-md-6">
                    <div class="form-group">
                        <label for="tournamentName" class="form-label"
                            >Tournament name</label
                        >
                        <input
                            id="tournamentName"
                            type="text"
                            class="form-control"
                            list="tournamentNames"
                            v-model="tournamentNameRule"
                            @change="onTournamentChange"
                            required
                        />
                        <datalist id="tournamentNames">
                            <option
                                v-for="name in tournamentNames"
                                :key="name"
                                :value="name"
                            />
                        </datalist>
                    </div>
                    <h4>Add players</h4>
                    <button
                        type="button"
                        class="btn btn-pdl btn-sm ml-2"
                        @click="fillFunnyNames"
                    >
                        Autofill names
                    </button>
                    <button
                        type="button"
                        class="btn btn-pdl btn-sm ml-2"
                        @click="fillDemoNinePlayers"
                    >
                        Load 9-player demo
                    </button>
                    <div
                        v-for="(player, index) in getPlayers"
                        :key="player.id"
                        class="form-group"
                    >
                        <input
                            type="text"
                            class="form-control mx-auto"
                            :placeholder="getPlayerPlaceholder(index)"
                            v-model="player.name"
                            @keyup="handlePlayerNameChange()"
                            :class="{
                                'is-invalid': isDuplicateName(player.id),
                                'is-second': getColorCodeGroup(player) === 2,
                                'is-first': getColorCodeGroup(player) === 1,
                            }"
                            required
                        />
                        <div class="mt-1">
                            <div class="form-check form-check-inline">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    :id="`left-${player.id}`"
                                    :name="`side-${player.id}`"
                                    value="Left"
                                    v-model="player.preferredSide"
                                />
                                <label
                                    class="form-check-label"
                                    :for="`left-${player.id}`"
                                >
                                    Left
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    :id="`right-${player.id}`"
                                    :name="`side-${player.id}`"
                                    value="Right"
                                    v-model="player.preferredSide"
                                />
                                <label
                                    class="form-check-label"
                                    :for="`right-${player.id}`"
                                >
                                    Right
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    :id="`both-${player.id}`"
                                    :name="`side-${player.id}`"
                                    value="Both"
                                    v-model="player.preferredSide"
                                />
                                <label
                                    class="form-check-label"
                                    :for="`both-${player.id}`"
                                >
                                    Both
                                </label>
                            </div>
                        </div>
                        <small
                            id="duplicateNameHelp"
                            class="form-text text-danger"
                            v-if="isDuplicateName(player.id)"
                        >
                            Name already used
                        </small>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <h4>Rules</h4>
                    <div>
                        <div class="form-group">
                            <label
                                class="form-check-label"
                                for="amountOfPlayers"
                            >
                                Number of players
                            </label>
                            <select
                                class="form-control"
                                id="amountOfPlayers"
                                v-model="amountOfPlayersRule"
                                @change="handleAmountOfPlayersChange"
                                :disabled="getIsGamePrepared"
                            >
                                <option
                                    v-for="n in playerOptions"
                                    :key="n"
                                    :value="n"
                                >
                                    {{ n }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="maxScoreInput" class="form-label"
                                >Max points per round</label
                            >
                            <input
                                type="text"
                                id="maxScoreInput"
                                class="form-control"
                                :class="{ 'is-invalid': maxScoreInvalid }"
                                v-model="maxScore"
                                @focusout="onMaxScoreChange"
                                required
                            />
                            <small
                                v-if="maxScoreInvalid"
                                id="maxScoreInvalidHelp"
                                class="text-danger"
                            >
                                Must be one or more digits.
                            </small>
                        </div>

                        <div class="form-group">
                            <label for="courtNames" class="form-label"
                                >Court names</label
                            >
                            <div
                                class="d-flex flex-row flex-wrap"
                                id="courtNames"
                            >
                                <template
                                    v-for="index in numberOfCourts"
                                    :key="index"
                                >
                                    <input
                                        type="text"
                                        class="form-control m-2"
                                        :placeholder="`Court ${index}`"
                                        :value="courtNamesRule[index - 1]"
                                        @input="
                                            updateCourtName(
                                                index - 1,
                                                $event.target.value
                                            )
                                        "
                                    />
                                </template>
                            </div>

                            <small id="courtNameInfo" class="text-muted">
                                Optional
                            </small>
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="randomScheduleRule"
                                    id="randomScheduleCheck"
                                    :disabled="getIsGamePrepared"
                                />
                                <label
                                    class="form-check-label"
                                    for="randomScheduleCheck"
                                >
                                    Shuffle schedule
                                </label>
                                <small
                                    id="randomScheduleHelp"
                                    class="form-text text-muted"
                                >
                                    Shuffling the schedule means a new draw even
                                    if the participants are the same players.
                                </small>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-check-label" for="modeSelect">
                                Game type
                            </label>
                            <select
                                class="form-control"
                                id="modeSelect"
                                v-model="modeRule"
                            >
                                <option value="Americano">Americano</option>
                                <option value="Mexicano">Mexicano</option>
                            </select>
                        </div>
                        <div
                            class="form-group"
                            v-if="amountOfPlayersRule === 16"
                        >
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="colorCodeRule"
                                    id="colorCodeCheck"
                                />
                                <label
                                    class="form-check-label"
                                    for="randomScheduleCheck"
                                >
                                    Color code groups
                                </label>
                                <small
                                    id="randomScheduleHelp"
                                    class="form-text text-muted"
                                >
                                    Color code the two groups so that it's clear
                                    who belongs together.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-3" v-if="modeRule === 'Mexicano'">
                <div class="col-12">
                    <SeedPlayers />
                </div>
            </div>

            <div class="form-group">
                <button type="button" @click="reset" class="btn btn-pdl mr-3">
                    <i class="las la-times"></i> Reset
                </button>
                <button class="btn btn-pdl">
                    {{ getAddPlayerText }} <i class="las la-arrow-right"></i>
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";
import { PadelRules } from "@/models/padelRules.interface";
import {
    getColorCodeGroupFromPlayer,
    getPadelPlayers,
} from "@/services/americanoService";
import { getDuplicateIds, isValidMaxScore } from "@/services/htmlHelperService";
import store from "@/store/index";
import { defineComponent } from "vue";
import { getTournamentNames } from "@/services/storageService";
import SeedPlayers from "@/components/americano/SeedPlayers.vue";

export default defineComponent({
    components: { SeedPlayers },
    data: function () {
        return {
            maxScore: 24,
            maxScoreInvalid: false,
            duplicateNameIds: [] as number[],
        };
    },
    methods: {
        onAddPlayers(): void {
            if (this.maxScoreInvalid) {
                return;
            }

            const duplicateIds = getDuplicateIds(this.getPlayers);

            if (duplicateIds.length > 0) {
                this.$data.duplicateNameIds = duplicateIds;
                return;
            }

            const isGamePrepared =
                store.getters.americanoStore.getIsGamePrepared;

            if (!isGamePrepared) {
                store.dispatch.americanoStore.prepareGames();
            }
            store.commit.americanoStore.INCREMENT_STEP();
        },
        getPlayerPlaceholder(index: number) {
            const playerNumber = Number(index) + 1;
            return "Player " + playerNumber;
        },
        reset() {
            store.commit.americanoStore.RESET();
            this.$data.duplicateNameIds = [];
            this.$data.maxScoreInvalid = false;
            this.$data.maxScore = 24;
        },
        onMaxScoreChange() {
            const value = this.$data.maxScore;

            if (!isValidMaxScore(value)) {
                this.maxScoreInvalid = true;
                return;
            }

            this.maxScoreInvalid = false;

            const numberValue = Number(value);
            const newRules: PadelRules = {
                ...store.getters.americanoStore.getRules,
                maxScore: numberValue,
            };
            store.commit.americanoStore.SET_RULES(newRules);
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
                    players.push({
                        name: "",
                        score: 0,
                        id: i + 1,
                        preferredSide: "Both",
                        seed: i + 1,
                    });
                }
            } else if (target < current.length) {
                players = players.slice(0, target);
            }

            store.commit.americanoStore.UPDATE_PLAYERS(players);
        },
        updateCourtName(index: number, name: string) {
            const courts = [...this.courtNamesRule];
            courts[index] = name;
            const newRules: PadelRules = {
                ...store.getters.americanoStore.getRules,
                courtNames: courts,
            };
            store.commit.americanoStore.SET_RULES(newRules);
        },
        fillFunnyNames() {
            const names = [
                "Rocket Racquet",
                "Paddle Pop",
                "Lobster",
                "Serve-ius Snape",
                "Smash Potato",
                "Slice Slice Baby",
                "Rally Belly",
                "Ace Ventura",
                "Court Jester",
                "Spin Doctor",
                "Net Ninja",
                "Paddle Pusher",
                "Faulty Tower",
                "Drop Shot",
                "Lob Machine",
                "Game of Throws",
            ];

            const players = [...this.getPlayers];
            players.forEach((p, i) => {
                p.name = names[i % names.length];
            });
            store.commit.americanoStore.UPDATE_PLAYERS(players);
        },
        fillDemoNinePlayers() {
            const demo = [
                { name: "Mathias", side: "Both" },
                { name: "Carl Emil", side: "Both" },
                { name: "Christian Frantsen", side: "Both" },
                { name: "Thomas Smidth", side: "Both" },
                { name: "Daniel", side: "Both" },
                { name: "Marco", side: "Right" },
                { name: "Jakob", side: "Right" },
                { name: "Brian", side: "Left" },
                { name: "Mads", side: "Left" },
            ];

            const players: PadelPlayer[] = demo.map((p, i) => ({
                name: p.name,
                score: 0,
                id: i + 1,
                preferredSide: p.side as PreferredSide,
                seed: i + 1,
            }));

            store.commit.americanoStore.UPDATE_PLAYERS(players);

            const newRules: PadelRules = {
                ...store.getters.americanoStore.getRules,
                amountOfPlayers: players.length,
                mode: "Americano",
            };

            store.commit.americanoStore.SET_RULES(newRules);
        },
        onTournamentChange() {
            const name = this.tournamentNameRule as string;
            const names = getTournamentNames();
            if (names.includes(name)) {
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
            if (store.getters.americanoStore.getRules.colorCode === false) {
                return 0;
            }

            if (!store.getters.americanoStore.getIsGamePrepared) {
                return store.getters.americanoStore.getPlayers.indexOf(
                    player
                ) <= 7
                    ? 1
                    : 2;
            }

            return getColorCodeGroupFromPlayer(
                player,
                store.getters.americanoStore.getPlayers,
                store.getters.americanoStore.getGames
            );
        },
    },
    created() {
        this.$data.maxScore = store.getters.americanoStore.getRules.maxScore;
    },
    watch: {
        getPlayers: {
            handler() {
                store.dispatch.americanoStore.saveStateManually();
            },
            deep: true,
        },
        getRules: {
            handler() {
                store.dispatch.americanoStore.saveStateManually();
            },
            deep: true,
        },
        tournamentNameRule() {
            store.dispatch.americanoStore.saveStateManually();
        },
    },
    computed: {
        getPlayers() {
            return store.getters.americanoStore.getPlayers;
        },
        getAddPlayerText() {
            const isGamePrepared =
                store.getters.americanoStore.getIsGamePrepared;

            if (isGamePrepared) {
                return "Go to matches";
            }

            return "Start turnament";
        },
        randomScheduleRule: {
            get() {
                return store.getters.americanoStore.getRules.randomSchedule;
            },
            set(value: boolean) {
                const newRules: PadelRules = {
                    ...store.getters.americanoStore.getRules,
                    randomSchedule: value,
                };
                store.commit.americanoStore.SET_RULES(newRules);
            },
        },
        amountOfPlayersRule: {
            get() {
                return store.getters.americanoStore.getRules.amountOfPlayers;
            },
            set(amount: number) {
                const colorCode =
                    Number(amount) === 16 ? this.colorCodeRule : false;

                const newRules: PadelRules = {
                    ...store.getters.americanoStore.getRules,
                    amountOfPlayers: amount,
                    colorCode: colorCode,
                };
                store.commit.americanoStore.SET_RULES(newRules);
            },
        },
        courtNamesRule: {
            get() {
                return store.getters.americanoStore.getRules.courtNames;
            },
            set(value: string[]) {
                const newRules: PadelRules = {
                    ...store.getters.americanoStore.getRules,
                    courtNames: value,
                };
                store.commit.americanoStore.SET_RULES(newRules);
            },
        },
        colorCodeRule: {
            get() {
                return store.getters.americanoStore.getRules.colorCode;
            },
            set(value: boolean) {
                const newRules: PadelRules = {
                    ...store.getters.americanoStore.getRules,
                    colorCode: value,
                };
                store.commit.americanoStore.SET_RULES(newRules);
            },
        },
        modeRule: {
            get() {
                return store.getters.americanoStore.getRules.mode;
            },
            set(value: string) {
                const newRules: PadelRules = {
                    ...store.getters.americanoStore.getRules,
                    mode: value as any,
                };
                store.commit.americanoStore.SET_RULES(newRules);
            },
        },
        getIsGamePrepared() {
            return store.getters.americanoStore.getIsGamePrepared;
        },
        playerOptions() {
            const options: number[] = [];
            for (let i = 4; i <= 64; i++) {
                options.push(i);
            }
            return options;
        },
        numberOfCourts() {
            return Math.floor(this.amountOfPlayersRule / 4);
        },
        tournamentNames() {
            return getTournamentNames();
        },
        tournamentNameRule: {
            get() {
                return store.getters.americanoStore.getTournamentName;
            },
            set(value: string) {
                store.commit.americanoStore.SET_TOURNAMENT_NAME(value);
            },
        },
    },
});
</script>

<style>
.is-second {
    background-color: rgba(15, 185, 177, 0.15);
}

.is-first {
    background-color: rgba(243, 156, 18, 0.15);
}
</style>
