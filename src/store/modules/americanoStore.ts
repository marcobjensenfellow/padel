import { GameSide } from "@/models/gameSide.enum";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { getPadelPlayers, prepareGames } from "@/services/americanoService";
import {
    evenScore,
    sortById,
    sortByScore,
    updatePlayerScores,
} from "@/services/scoreService";
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
    maxScore: number;
}

export interface AmericanoStoreGetters {
    getGames: PadelGame[];
    getPlayers: PadelPlayer[];
    getStep: number;
    getIsGamePrepared: boolean;
    getMaxScore: number;
}

export interface AmericanoStoreActions {
    commit: Function;
    getters: AmericanoStoreGetters;
    dispatch: Function;
}

export default {
    namespaced: true as true,
    state: {
        games: [],
        players: getPadelPlayers(),
        step: 1,
        isGamePrepared: false,
        maxScore: 32,
    } as AmericanoStoreState,
    mutations: {
        UPDATE_GAMES(state: AmericanoStoreState, games: PadelGame[]) {
            state.games = games;
            state.isGamePrepared = true;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.maxScore
            );
        },
        UPDATE_PLAYERS(state: AmericanoStoreState, players: PadelPlayer[]) {
            state.players = players;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.maxScore
            );
        },
        INCREMENT_STEP(state: AmericanoStoreState) {
            state.step += 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.maxScore
            );
        },
        DECREMENT_STEP(state: AmericanoStoreState) {
            state.step -= 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.maxScore
            );
        },
        SET_MAX_SCORE(state: AmericanoStoreState, score: number) {
            state.maxScore = score;
        },
        RESET(state: AmericanoStoreState) {
            state.players = getPadelPlayers();
            state.games = [];
            state.step = 1;
            state.isGamePrepared = false;
            state.maxScore = 32;
            removeAmericanoState();
        },
        LOAD_STATE(state: AmericanoStoreState) {
            const americanoState = loadAmericanoState();

            if (!americanoState) {
                return;
            }

            state.players = americanoState.players;
            state.games = americanoState.games;
            state.step = americanoState.step;
            state.isGamePrepared = true;
            state.maxScore = americanoState.maxScore;
        },
    },
    actions: {
        prepareGames({ commit, getters }: AmericanoStoreActions) {
            const games = prepareGames(getters.getPlayers);
            commit("UPDATE_GAMES", games);
        },
        updatePlayerScores({ commit, getters }: AmericanoStoreActions) {
            const updatedPlayers = updatePlayerScores(
                getters.getPlayers,
                getters.getGames
            );
            commit("UPDATE_PLAYERS", updatedPlayers);
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
                getters.getMaxScore
            );
        },
    },
    getters: {
        getGames: (state: AmericanoStoreState) => state.games,
        getPlayers: (state: AmericanoStoreState) => state.players,
        getStep: (state: AmericanoStoreState) => state.step,
        getIsGamePrepared: (state: AmericanoStoreState) => state.isGamePrepared,
        getMaxScore: (state: AmericanoStoreState) => state.maxScore,
    },
};
