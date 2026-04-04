import {
    updatePlayerScores,
    sortByScore,
    sortById,
    evenScore,
    removeNotNumbers,
} from "@/services/scoreService";
import { GameSide } from "@/models/gameSide.enum";
import { PadelGame } from "@/models/padelGame.interface";
import { makePlayers } from "./helpers";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeGame(
    id: number,
    homePlayerIds: number[],
    awayPlayerIds: number[],
    homeScore: number | null,
    awayScore: number | null
): PadelGame {
    return {
        id,
        round: 1,
        matchNumber: id,
        playGroup: 1,
        homeScore,
        awayScore,
        players: [
            ...homePlayerIds.map(pid => ({ playerId: pid, home: true })),
            ...awayPlayerIds.map(pid => ({ playerId: pid, home: false })),
        ],
    };
}

// ─── updatePlayerScores ───────────────────────────────────────────────────────

describe("updatePlayerScores", () => {
    it("accumulates home scores for home players", () => {
        const players = makePlayers(4);
        const games = [makeGame(1, [1, 2], [3, 4], 16, 8)];

        const result = updatePlayerScores(players, games, 24);
        expect(result.find(p => p.id === 1)?.score).toBe(16);
        expect(result.find(p => p.id === 2)?.score).toBe(16);
    });

    it("accumulates away scores for away players", () => {
        const players = makePlayers(4);
        const games = [makeGame(1, [1, 2], [3, 4], 16, 8)];

        const result = updatePlayerScores(players, games, 24);
        expect(result.find(p => p.id === 3)?.score).toBe(8);
        expect(result.find(p => p.id === 4)?.score).toBe(8);
    });

    it("accumulates scores across multiple games", () => {
        const players = makePlayers(4);
        const games = [
            makeGame(1, [1, 2], [3, 4], 14, 10),
            makeGame(2, [1, 3], [2, 4], 20, 4),
        ];

        const result = updatePlayerScores(players, games, 24);
        // Player 1: 14 (home, game1) + 20 (home, game2) = 34
        expect(result.find(p => p.id === 1)?.score).toBe(34);
        // Player 2: 14 (home, game1) + 4 (away, game2) = 18
        expect(result.find(p => p.id === 2)?.score).toBe(18);
    });

    it("treats null scores as 0", () => {
        const players = makePlayers(4);
        const games = [makeGame(1, [1, 2], [3, 4], null, null)];

        const result = updatePlayerScores(players, games, 24);
        result.forEach(p => expect(p.score).toBe(0));
    });

    it("gives sit-out players half the max score", () => {
        const players = makePlayers(2);
        const sitOutGame: PadelGame = {
            id: 1, round: 1, matchNumber: 0, playGroup: 1,
            homeScore: null, awayScore: null,
            players: [{ playerId: 1, home: true, side: "Left" }],
        };

        const result = updatePlayerScores(players, [sitOutGame], 24);
        expect(result.find(p => p.id === 1)?.score).toBe(12); // 24 / 2
    });

    it("resets scores to 0 before accumulating", () => {
        const players = makePlayers(4);
        players.forEach(p => { p.score = 999; }); // dirty state

        const games = [makeGame(1, [1, 2], [3, 4], 10, 14)];
        const result = updatePlayerScores(players, games, 24);
        expect(result.find(p => p.id === 1)?.score).toBe(10);
    });

    it("ignores players not in any game", () => {
        const players = makePlayers(5);
        const games = [makeGame(1, [1, 2], [3, 4], 20, 4)];

        const result = updatePlayerScores(players, games, 24);
        // Player 5 never appears in a game — score stays 0
        expect(result.find(p => p.id === 5)?.score).toBe(0);
    });
});

// ─── sortByScore / sortById ───────────────────────────────────────────────────

describe("sortByScore", () => {
    it("sorts players from highest to lowest score", () => {
        const players = makePlayers(4);
        players[0].score = 10;
        players[1].score = 40;
        players[2].score = 25;
        players[3].score = 5;

        const sorted = sortByScore([...players]);
        expect(sorted[0].score).toBe(40);
        expect(sorted[3].score).toBe(5);
    });

    it("handles equal scores without throwing", () => {
        const players = makePlayers(3);
        players.forEach(p => { p.score = 20; });
        expect(() => sortByScore([...players])).not.toThrow();
    });
});

describe("sortById", () => {
    it("sorts players in ascending id order", () => {
        const players = makePlayers(4);
        const shuffled = [players[3], players[1], players[0], players[2]];
        const sorted = sortById(shuffled);
        expect(sorted.map(p => p.id)).toEqual([1, 2, 3, 4]);
    });
});

// ─── evenScore ────────────────────────────────────────────────────────────────

describe("evenScore", () => {
    it("sets away score as complement of home score", () => {
        const game = makeGame(1, [1, 2], [3, 4], 18, null);
        evenScore(game, 24, GameSide.Home);
        expect(game.awayScore).toBe(6); // 24 - 18
    });

    it("sets home score as complement of away score", () => {
        const game = makeGame(1, [1, 2], [3, 4], null, 10);
        evenScore(game, 24, GameSide.Away);
        expect(game.homeScore).toBe(14); // 24 - 10
    });

    it("does nothing when the scored side is null", () => {
        const game = makeGame(1, [1, 2], [3, 4], null, null);
        evenScore(game, 24, GameSide.Home);
        expect(game.awayScore).toBeNull();
    });
});

// ─── removeNotNumbers ─────────────────────────────────────────────────────────

describe("removeNotNumbers", () => {
    it("clamps score above maxScore to maxScore", () => {
        const game = makeGame(1, [1, 2], [3, 4], 30, null);
        removeNotNumbers(game, GameSide.Home, 24);
        expect(game.homeScore).toBe(24);
    });

    it("clamps negative score to 0", () => {
        const game = makeGame(1, [1, 2], [3, 4], -5, null);
        removeNotNumbers(game, GameSide.Home, 24);
        expect(game.homeScore).toBe(0);
    });

    it("sets NaN to null", () => {
        const game = makeGame(1, [1, 2], [3, 4], NaN, null);
        removeNotNumbers(game, GameSide.Home, 24);
        expect(game.homeScore).toBeNull();
    });

    it("leaves valid score unchanged", () => {
        const game = makeGame(1, [1, 2], [3, 4], 18, null);
        removeNotNumbers(game, GameSide.Home, 24);
        expect(game.homeScore).toBe(18);
    });

    it("works for the Away side too", () => {
        const game = makeGame(1, [1, 2], [3, 4], null, 99);
        removeNotNumbers(game, GameSide.Away, 24);
        expect(game.awayScore).toBe(24);
    });
});
