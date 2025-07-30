import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { PadelRules } from "@/models/padelRules.interface";
import type { Commit, Dispatch } from "vuex";
import {
    allNamesAreEmpty,
    getPadelPlayers,
    prepareGames,
} from "@/services/americanoService";
import {
    sortById,
    sortByScore,
    updatePlayerScores,
} from "@/services/scoreService";
import {
    prepareMexicanoRound,
    totalRounds,
} from "@/services/mexicanoService";
import {
    prepareMexicanoRound,
    totalRounds,
} from "@/services/mexicanoService";
import {
    loadAmericanoState,
    removeAmericanoState,
    saveAmericanoState,
} from "@/services/storageService";

export interface AmericanoStoreState {
    games: PadelGame[];
    players: PadelPlayer[];
    step: number;
    isGamePrepared: boolean;
    rules: PadelRules;
    round: number;
}

export interface AmericanoStoreGetters {
    getGames: PadelGame[];
    getPlayers: PadelPlayer[];
    getStep: number;
    getIsGamePrepared: boolean;
    getRules: PadelRules;
    getRound: number;
}

export interface AmericanoStoreActions {
    commit: Commit;
    getters: AmericanoStoreGetters;
    dispatch: Dispatch;
}

export default {
    namespaced: true as const,

    state: {
        games: [],
        players: getPadelPlayers(),
        step: 1,
        isGamePrepared: false,
        round: 1,
        rules: {
            maxScore: 32,
            randomSchedule: false,
            amountOfPlayers: 8,
            colorCode: false,
            courtNames: ["", ""],
            mode: "Americano",
        },
    } as AmericanoStoreState,
    mutations: {
        UPDATE_GAMES(state: AmericanoStoreState, games: PadelGame[]) {
            state.games = games;
            state.isGamePrepared = true;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        UPDATE_PLAYERS(state: AmericanoStoreState, players: PadelPlayer[]) {
            state.players = players;
            state.rules.amountOfPlayers = players.length;


            if (allNamesAreEmpty(players)) {
                return;
            }

            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        INCREMENT_STEP(state: AmericanoStoreState) {
            state.step += 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        INCREMENT_ROUND(state: AmericanoStoreState) {
            state.round += 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        DECREMENT_STEP(state: AmericanoStoreState) {
            state.step -= 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        SET_RULES(state: AmericanoStoreState, rules: PadelRules) {
            state.rules = rules;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round
            );
        },
        RESET(state: AmericanoStoreState) {
            state.players = getPadelPlayers();
            state.games = [];
            state.step = 1;
            state.round = 1;
            state.isGamePrepared = false;
            state.rules.maxScore = 32;
            state.rules.randomSchedule = false;
            state.rules.amountOfPlayers = 8;
            state.rules.colorCode = false;
            state.rules.courtNames = ["", ""];
            state.rules.mode = "Americano";
            removeAmericanoState();
        },
        LOAD_STATE(state: AmericanoStoreState) {

            const americanoState = loadAmericanoState();

            if (!americanoState) {
                return;
            }

            if (allNamesAreEmpty(americanoState.players)) {
                return;
            }

            state.players = americanoState.players;
            state.players.forEach((p, index) => {
                if (p.seed === undefined) {
                    p.seed = index + 1;
                }
            });
            state.games = americanoState.games;
            state.step = americanoState.step;
            state.round = americanoState.round || 1;
            state.isGamePrepared = true;
            state.rules = americanoState.rules;
        },
    },
    actions: {
        prepareGames({ commit, getters }: AmericanoStoreActions) {
            if (getters.getRules.mode === "Mexicano") {
                const games = prepareMexicanoRound(getters.getPlayers, getters.getRound);
                commit("UPDATE_GAMES", games);
            } else {
                const games = prepareGames(
                    getters.getPlayers,
                    getters.getRules.randomSchedule
                );
                commit("UPDATE_GAMES", games);
            }
        },
        updatePlayerScores({ commit, getters }: AmericanoStoreActions) {
            const updatedPlayers = updatePlayerScores(
                getters.getPlayers,
                getters.getGames
            );
            commit("UPDATE_PLAYERS", updatedPlayers);

            if (getters.getRules.mode === "Mexicano") {
                if (getters.getRound >= totalRounds(getters.getPlayers.length)) {
                    commit("INCREMENT_STEP");
                } else {
                    commit("INCREMENT_ROUND");
                    const nextGames = prepareMexicanoRound(
                        getters.getPlayers,
                        getters.getRound
                    );
                    commit("UPDATE_GAMES", nextGames);
                }
                return;
            }

            commit("INCREMENT_STEP");
        },
        sortPlayersByScore({ commit, getters }: AmericanoStoreActions) {
            const sortedPlayers = sortByScore(getters.getPlayers);
            commit("UPDATE_PLAYERS", sortedPlayers);
        },
        sortPlayersById({ commit, getters }: AmericanoStoreActions) {
            const sortedPlayers = sortById(getters.getPlayers);
            commit("UPDATE_PLAYERS", sortedPlayers);
        },
        newGame({ commit }: AmericanoStoreActions) {
            commit("RESET");
        },
        saveStateManually({ getters }: AmericanoStoreActions) {
            saveAmericanoState(
                getters.getPlayers,
                getters.getGames,
                getters.getStep,
                getters.getRules,
                getters.getRound
            );
        },
    },
    getters: {
        getGames: (state: AmericanoStoreState) => state.games,
        getPlayers: (state: AmericanoStoreState) => state.players,
        getStep: (state: AmericanoStoreState) => state.step,
        getIsGamePrepared: (state: AmericanoStoreState) => state.isGamePrepared,
        getRules: (state: AmericanoStoreState) => state.rules,
        getRound: (state: AmericanoStoreState) => state.round,
    },
};
