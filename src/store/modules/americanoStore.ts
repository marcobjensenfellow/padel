import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";
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
import { prepareMexicanoRound, totalRounds, applyCategorySeeding, applyRandomSeeding } from "@/services/mexicanoService";
import {
    loadAmericanoState,
    removeAmericanoState,
    saveAmericanoState,
    getCurrentTournamentName,
    setCurrentTournamentName,
} from "@/services/storageService";
import { upsertToHistory, TournamentSummary } from "@/services/tournamentHistoryService";

export interface AmericanoStoreState {
    games: PadelGame[];
    players: PadelPlayer[];
    step: number;
    isGamePrepared: boolean;
    rules: PadelRules;
    round: number;
    tournamentName: string;
    tournamentId: string;
}

export interface AmericanoStoreGetters {
    getGames: PadelGame[];
    getPlayers: PadelPlayer[];
    getStep: number;
    getIsGamePrepared: boolean;
    getRules: PadelRules;
    getRound: number;
    getTournamentName: string;
    getTournamentId: string;
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
        tournamentName: new Date().toISOString().slice(0, 10),
        tournamentId: `t_${Date.now()}`,
        rules: {
            maxScore: 24,
            randomSchedule: false,
            amountOfPlayers: 8,
            colorCode: false,
            courtNames: Array(16).fill(""),
            mode: "Americano",
            seedingMode: "exact",
            respectPreferredSides: false,
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
                state.round,
                state.tournamentName
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
                state.round,
                state.tournamentName
            );
        },
        INCREMENT_STEP(state: AmericanoStoreState) {
            state.step += 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round,
                state.tournamentName
            );
        },
        INCREMENT_ROUND(state: AmericanoStoreState) {
            state.round += 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round,
                state.tournamentName
            );
        },
        DECREMENT_STEP(state: AmericanoStoreState) {
            state.step -= 1;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round,
                state.tournamentName
            );
        },
        SET_RULES(state: AmericanoStoreState, rules: PadelRules) {
            state.rules = rules;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round,
                state.tournamentName
            );
        },
        SET_TOURNAMENT_NAME(state: AmericanoStoreState, name: string) {
            state.tournamentName = name;
            saveAmericanoState(
                state.players,
                state.games,
                state.step,
                state.rules,
                state.round,
                state.tournamentName
            );
        },
        RESET(state: AmericanoStoreState) {
            // Save current tournament to history before wiping
            if (state.isGamePrepared && state.players.some(p => p.name.trim() !== "")) {
                const sorted = [...state.players].sort((a, b) => b.score - a.score);
                const summary: TournamentSummary = {
                    id: state.tournamentId,
                    name: (state.rules as any).tournamentName?.trim() || state.tournamentName,
                    savedAt: new Date().toISOString(),
                    format: state.rules.mode,
                    numPlayers: state.rules.amountOfPlayers,
                    roundsPlayed: state.round,
                    totalRounds: state.rules.mode === "Mexicano"
                        ? state.rules.amountOfPlayers - 1
                        : 1,
                    completed: true,
                    top3: sorted.slice(0, 3).map(p => ({ name: p.name, score: p.score })),
                };
                upsertToHistory(summary);
            }
            state.players = getPadelPlayers();
            state.games = [];
            state.step = 1;
            state.round = 1;
            state.isGamePrepared = false;
            state.rules.maxScore = 24;
            state.rules.randomSchedule = false;
            state.rules.amountOfPlayers = 8;
            state.rules.colorCode = false;
            state.rules.courtNames = Array(16).fill("");
            state.rules.mode = "Americano";
            state.rules.seedingMode = "exact";
            state.rules.respectPreferredSides = false;
            removeAmericanoState(state.tournamentName);
            state.tournamentName = new Date().toISOString().slice(0, 10);
            state.tournamentId = `t_${Date.now()}`;
        },
        LOAD_STATE(state: AmericanoStoreState, name?: string) {
            const americanoState = loadAmericanoState(name);
            if (name) {
                setCurrentTournamentName(name);
            }

            const currentName = name || getCurrentTournamentName();

            if (currentName) {
                state.tournamentName = currentName;
            }

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
            // If preferred sides are disabled, treat everyone as "Both" for game prep
            const withSides = (players: PadelPlayer[]): PadelPlayer[] =>
                getters.getRules.respectPreferredSides
                    ? players
                    : players.map(p => ({ ...p, preferredSide: "Both" as PreferredSide }));

            if (getters.getRules.mode === "Mexicano") {
                // Apply seeding mode before first round
                let players = getters.getPlayers;
                if (getters.getRules.seedingMode === "random") {
                    players = applyRandomSeeding(players);
                    commit("UPDATE_PLAYERS", players);
                } else if (getters.getRules.seedingMode === "category") {
                    players = applyCategorySeeding(players);
                    commit("UPDATE_PLAYERS", players);
                }
                // "exact": list order is already the seed order — no change needed
                const games = prepareMexicanoRound(
                    withSides(players),
                    getters.getRound
                );
                commit("UPDATE_GAMES", games);
            } else {
                const games = prepareGames(
                    withSides(getters.getPlayers),
                    getters.getRules.randomSchedule
                );
                commit("UPDATE_GAMES", games);
            }
        },
        updatePlayerScores({ commit, getters }: AmericanoStoreActions) {
            const updatedPlayers = updatePlayerScores(
                getters.getPlayers,
                getters.getGames,
                getters.getRules.maxScore
            );
            commit("UPDATE_PLAYERS", updatedPlayers);

            // Snapshot to history so results appear even if app is closed after this
            const sorted = [...updatedPlayers].sort((a, b) => b.score - a.score);
            const isMexicano = getters.getRules.mode === "Mexicano";
            const summary: TournamentSummary = {
                id: getters.getTournamentId,
                name: (getters.getRules as any).tournamentName?.trim() || getters.getTournamentName,
                savedAt: new Date().toISOString(),
                format: getters.getRules.mode,
                numPlayers: getters.getRules.amountOfPlayers,
                roundsPlayed: getters.getRound,
                totalRounds: isMexicano ? getters.getRules.amountOfPlayers - 1 : 1,
                completed: !isMexicano || getters.getRound >= getters.getRules.amountOfPlayers - 1,
                top3: sorted.slice(0, 3).map(p => ({ name: p.name, score: p.score })),
            };
            upsertToHistory(summary);

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
                getters.getRound,
                getters.getTournamentName
            );
        },
        nextRound({ commit, getters }: AmericanoStoreActions) {
            if (getters.getRules.mode === "Mexicano") {
                if (getters.getRound < totalRounds(getters.getPlayers.length)) {
                    commit("INCREMENT_ROUND");
                    const playersForRound = getters.getRules.respectPreferredSides
                        ? getters.getPlayers
                        : getters.getPlayers.map((p: PadelPlayer) => ({ ...p, preferredSide: "Both" as PreferredSide }));
                    const nextGames = prepareMexicanoRound(
                        playersForRound,
                        getters.getRound
                    );
                    commit("UPDATE_GAMES", nextGames);
                }
            }

            commit("DECREMENT_STEP");
        },
        // Calculates scores and either jumps to next Mexicano round (staying on
        // the games screen) or advances to the results screen for the last/only round.
        advanceRound({ commit, getters }: AmericanoStoreActions) {
            const updatedPlayers = updatePlayerScores(
                getters.getPlayers,
                getters.getGames,
                getters.getRules.maxScore
            );
            commit("UPDATE_PLAYERS", updatedPlayers);

            const isMexicano = getters.getRules.mode === "Mexicano";
            const currentRound = getters.getRound;
            const maxRounds = totalRounds(getters.getPlayers.length);

            if (isMexicano && currentRound < maxRounds) {
                const newRound = currentRound + 1;
                commit("INCREMENT_ROUND");
                const withSides = getters.getRules.respectPreferredSides
                    ? updatedPlayers
                    : updatedPlayers.map((p: PadelPlayer) => ({ ...p, preferredSide: "Both" as PreferredSide }));
                const nextGames = prepareMexicanoRound(withSides, newRound);
                commit("UPDATE_GAMES", nextGames);
                // Snapshot progress to history (ongoing)
                const sortedAdv = [...updatedPlayers].sort((a, b) => b.score - a.score);
                upsertToHistory({
                    id: getters.getTournamentId,
                    name: (getters.getRules as any).tournamentName?.trim() || getters.getTournamentName,
                    savedAt: new Date().toISOString(),
                    format: getters.getRules.mode,
                    numPlayers: getters.getRules.amountOfPlayers,
                    roundsPlayed: currentRound,
                    totalRounds: maxRounds,
                    completed: false,
                    top3: sortedAdv.slice(0, 3).map((p: PadelPlayer) => ({ name: p.name, score: p.score })),
                });
                // Stay on step 2 (games screen) — no step change
            } else {
                commit("INCREMENT_STEP");
            }
        },
    },
    getters: {
        getGames: (state: AmericanoStoreState) => state.games,
        getPlayers: (state: AmericanoStoreState) => state.players,
        getStep: (state: AmericanoStoreState) => state.step,
        getIsGamePrepared: (state: AmericanoStoreState) => state.isGamePrepared,
        getRules: (state: AmericanoStoreState) => state.rules,
        getRound: (state: AmericanoStoreState) => state.round,
        getTournamentName: (state: AmericanoStoreState) => state.tournamentName,
        getTournamentId: (state: AmericanoStoreState) => state.tournamentId,
    },
};
