import {
    getPadelPlayers,
    prepareGames,
    allNamesAreEmpty,
    getMaxRound,
} from "@/services/americanoService";
import { makePlayers } from "./helpers";

// ─── getPadelPlayers ─────────────────────────────────────────────────────────

describe("getPadelPlayers", () => {
    it("returns 8 players by default", () => {
        expect(getPadelPlayers().length).toBe(8);
    });

    it("returns the requested number of players", () => {
        expect(getPadelPlayers(12).length).toBe(12);
    });

    it("assigns ids starting at 1", () => {
        const players = getPadelPlayers(4);
        expect(players.map(p => p.id)).toEqual([1, 2, 3, 4]);
    });

    it("initialises score to 0 and preferredSide to Both", () => {
        getPadelPlayers(4).forEach(p => {
            expect(p.score).toBe(0);
            expect(p.preferredSide).toBe("Both");
        });
    });
});

// ─── allNamesAreEmpty ────────────────────────────────────────────────────────

describe("allNamesAreEmpty", () => {
    it("returns true when all names are empty", () => {
        expect(allNamesAreEmpty(getPadelPlayers(4))).toBe(true);
    });

    it("returns false when at least one name is set", () => {
        const players = getPadelPlayers(4);
        players[0].name = "Alice";
        expect(allNamesAreEmpty(players)).toBe(false);
    });
});

// ─── getMaxRound ─────────────────────────────────────────────────────────────

describe("getMaxRound", () => {
    it("returns 0 for an empty game list", () => {
        expect(getMaxRound([])).toBe(0);
    });

    it("returns the highest round number present", () => {
        const players = makePlayers(8);
        const games = prepareGames(players, false);
        const max = getMaxRound(games);
        expect(max).toBe(7); // 8-player Americano has 7 rounds
    });
});

// ─── prepareGames (8 players — fixed schedule) ───────────────────────────────

describe("prepareGames — 8 players", () => {
    const players = makePlayers(8);
    const games = prepareGames(players, false);

    it("generates 14 games (7 rounds × 2 courts)", () => {
        expect(games.length).toBe(14);
    });

    it("every game has exactly 4 players", () => {
        games.forEach(g => expect(g.players.length).toBe(4));
    });

    it("each game has 2 home and 2 away players", () => {
        games.forEach(g => {
            const home = g.players.filter(p => p.home).length;
            const away = g.players.filter(p => !p.home).length;
            expect(home).toBe(2);
            expect(away).toBe(2);
        });
    });

    it("every player appears in every round exactly once", () => {
        const rounds = [...new Set(games.map(g => g.round))];
        rounds.forEach(round => {
            const roundGames = games.filter(g => g.round === round);
            const playerIds = roundGames.flatMap(g => g.players.map(p => p.playerId));
            // 8 players, each appears exactly once
            expect(playerIds.length).toBe(8);
            expect(new Set(playerIds).size).toBe(8);
        });
    });

    it("all scores start as null", () => {
        games.forEach(g => {
            expect(g.homeScore).toBeNull();
            expect(g.awayScore).toBeNull();
        });
    });
});

// ─── prepareGames (9 players — odd count, oversitter support) ────────────────

describe("prepareGames — 9 players (odd count)", () => {
    const players = makePlayers(9);
    const games = prepareGames(players, false);

    it("produces games across 9 rounds", () => {
        const rounds = new Set(games.map(g => g.round));
        expect(rounds.size).toBe(9);
    });

    it("each round has exactly 1 oversitter (single-player sit-out game)", () => {
        const rounds = [...new Set(games.map(g => g.round))];
        rounds.forEach(round => {
            const sitOuts = games.filter(g => g.round === round && g.players.length === 1);
            expect(sitOuts.length).toBe(1);
        });
    });

    it("each round has exactly 2 four-player games (8 active players)", () => {
        const rounds = [...new Set(games.map(g => g.round))];
        rounds.forEach(round => {
            const realGames = games.filter(g => g.round === round && g.players.length === 4);
            expect(realGames.length).toBe(2);
        });
    });
});

// ─── prepareGames (12 players — general random schedule) ─────────────────────

describe("prepareGames — 12 players", () => {
    const players = makePlayers(12);
    const games = prepareGames(players, false);

    it("produces 12 rounds", () => {
        expect(new Set(games.map(g => g.round)).size).toBe(12);
    });

    it("every 4-player game in each round uses distinct players", () => {
        const rounds = [...new Set(games.map(g => g.round))];
        rounds.forEach(round => {
            const realGames = games.filter(g => g.round === round && g.players.length === 4);
            const ids = realGames.flatMap(g => g.players.map(p => p.playerId));
            expect(new Set(ids).size).toBe(ids.length); // no duplicates per round
        });
    });
});
