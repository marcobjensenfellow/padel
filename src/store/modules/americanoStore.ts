import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";

export interface AmericanoStore {
    games: PadelGame[];
    players: PadelPlayer[];
}

export default {
    namespaced: true as true,
    state: {
        games: [],
        players: [],
    } as AmericanoStore,
    mutations: {
        UPDATE_GAMES(state: AmericanoStore, games: PadelGame[]) {
            state.games = games;
        },
    },
    actions: {},
    getters: {
        games: (state: AmericanoStore) => state.games,
    },
};
