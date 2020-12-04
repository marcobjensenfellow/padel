import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { getPadelPlayers, prepareGames } from "@/services/americanoService";
import { sortByScore, updatePlayerScores } from "@/services/scoreService";

export interface AmericanoStoreState {
    games: PadelGame[];
    players: PadelPlayer[];
    step: number;
}

export interface AmericanoStoreGetters {
    getGames: PadelGame[];
    getPlayers: PadelPlayer[];
    getStep: number;
}

export interface AmericanoStoreActions {
    commit: Function;
    getters: AmericanoStoreGetters;
}

export default {
    namespaced: true as true,
    state: {
        games: [],
        players: getPadelPlayers(),
        step: 1,
    } as AmericanoStoreState,
    mutations: {
        UPDATE_GAMES(state: AmericanoStoreState, games: PadelGame[]) {
            state.games = games;
        },
        UPDATE_PLAYERS(state: AmericanoStoreState, players: PadelPlayer[]) {
            state.players = players;
        },
        INCREMENT_STEP(state: AmericanoStoreState) {
            state.step += 1;
        },
        DECREMENT_STEP(state: AmericanoStoreState) {
            state.step -= 1;
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
        sortPlayers({ commit, getters }: AmericanoStoreActions) {
            const sortedPlayers = sortByScore(getters.getPlayers);
            commit("UPDATE_PLAYERS", sortedPlayers);
        },
    },
    getters: {
        getGames: (state: AmericanoStoreState) => state.games,
        getPlayers: (state: AmericanoStoreState) => state.players,
        getStep: (state: AmericanoStoreState) => state.step,
    },
};
