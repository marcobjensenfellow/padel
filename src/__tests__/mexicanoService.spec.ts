import {
    prepareMexicanoRound,
    totalRounds,
    numCategoriesForPlayers,
    applyCategorySeeding,
    applyRandomSeeding,
} from "@/services/mexicanoService";
import { makePlayers, makeRankedPlayers } from "./helpers";

// ─── totalRounds ─────────────────────────────────────────────────────────────

describe("totalRounds", () => {
    it("returns n-1 for any player count", () => {
        [4, 8, 9, 12, 16].forEach(n => {
            expect(totalRounds(n)).toBe(n - 1);
        });
    });
});

// ─── numCategoriesForPlayers ──────────────────────────────────────────────────

describe("numCategoriesForPlayers", () => {
    it("returns 2 for 8 players", () => {
        expect(numCategoriesForPlayers(8)).toBe(2);
    });

    it("returns 3 for 16 players", () => {
        expect(numCategoriesForPlayers(16)).toBe(3);
    });

    it("returns 4 for 24 players", () => {
        expect(numCategoriesForPlayers(24)).toBe(4);
    });

    it("caps at 5 for large player counts", () => {
        expect(numCategoriesForPlayers(100)).toBe(5);
    });

    it("returns at least 2 for small counts", () => {
        expect(numCategoriesForPlayers(4)).toBe(2);
    });
});

// ─── prepareMexicanoRound ─────────────────────────────────────────────────────

describe("prepareMexicanoRound — 8 players", () => {
    const players = makeRankedPlayers(8); // scores 80, 70, 60, 50, 40, 30, 20, 10
    const games = prepareMexicanoRound(players, 1);

    it("generates 2 games for 8 players", () => {
        expect(games.length).toBe(2);
    });

    it("every game has 4 players", () => {
        games.forEach(g => expect(g.players.length).toBe(4));
    });

    it("sets the correct round number", () => {
        games.forEach(g => expect(g.round).toBe(1));
    });

    it("pairs the top-ranked players against each other (rank 1&4 vs 2&3)", () => {
        // Players sorted by score: [1,2,3,4,5,6,7,8]
        // Standard Mexicano: game1 = #1&#4 vs #2&#3; game2 = #5&#8 vs #6&#7
        const game1Ids = new Set(games[0].players.map(p => p.playerId));
        const topFourIds = new Set([1, 2, 3, 4]);
        expect([...game1Ids].every(id => topFourIds.has(id))).toBe(true);
    });

    it("all scores start as null", () => {
        games.forEach(g => {
            expect(g.homeScore).toBeNull();
            expect(g.awayScore).toBeNull();
        });
    });
});

describe("prepareMexicanoRound — score-based sorting", () => {
    it("higher-scored players face each other, lower-scored face each other", () => {
        const players = makePlayers(8);
        players[0].score = 100; // Player 1 — best
        players[1].score = 90;  // Player 2
        players[2].score = 80;  // Player 3
        players[3].score = 70;  // Player 4
        players[4].score = 10;  // Player 5 — worst
        players[5].score = 10;
        players[6].score = 10;
        players[7].score = 10;

        const games = prepareMexicanoRound(players, 2);

        const game1Ids = new Set(games[0].players.map(p => p.playerId));
        // Players 1-4 should be in game 1 (top performers)
        expect(game1Ids.has(1)).toBe(true);
        expect(game1Ids.has(2)).toBe(true);
    });

    it("uses seed as tiebreaker when scores are equal", () => {
        const players = makePlayers(8); // all score = 0, seeds 1..8
        const games = prepareMexicanoRound(players, 1);
        // With equal scores, player 1 (seed 1) is in game 1
        const game1Ids = games[0].players.map(p => p.playerId);
        expect(game1Ids).toContain(1);
    });
});

describe("prepareMexicanoRound — 9 players (oversitter)", () => {
    const players = makePlayers(9);
    const games = prepareMexicanoRound(players, 1);

    it("creates 3 game entries for 9 players (2 real games + 1 sit-out)", () => {
        // 8 active → 2 four-player games; 1 oversitter → 1 single-player entry
        expect(games.length).toBe(3);
    });

    it("one entry is a single-player sit-out", () => {
        const sitOuts = games.filter(g => g.players.length === 1);
        expect(sitOuts.length).toBe(1);
    });
});

// ─── applyCategorySeeding ─────────────────────────────────────────────────────

describe("applyCategorySeeding", () => {
    it("groups players by category (cat 0 first, then 1)", () => {
        const players = makePlayers(8);
        // Mark second half as category 1 (Bottom)
        [4, 5, 6, 7].forEach(i => {
            players[i].seedCategory = 1;
        });

        const result = applyCategorySeeding(players);
        const seeds = result.map(p => p.seed);

        // Top group should have seeds 1–4, Bottom group 5–8
        expect(seeds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

        // Category 0 players come first
        const cats = result.map(p => p.seedCategory ?? 0);
        expect(cats).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
    });

    it("assigns consecutive seeds starting at 1", () => {
        const players = makePlayers(6);
        players[0].seedCategory = 1;
        players[3].seedCategory = 1;

        const result = applyCategorySeeding(players);
        const seeds = result.map(p => p.seed).sort((a, b) => a - b);
        expect(seeds).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("preserves within-category order (no shuffle)", () => {
        const players = makePlayers(4);
        players[1].seedCategory = 1;
        players[3].seedCategory = 1;
        // Cat 0: players 1, 3 (original list positions 0, 2)
        // Cat 1: players 2, 4 (original list positions 1, 3)

        const result = applyCategorySeeding(players);
        const cat0Ids = result.filter(p => (p.seedCategory ?? 0) === 0).map(p => p.id);
        const cat1Ids = result.filter(p => (p.seedCategory ?? 0) === 1).map(p => p.id);
        expect(cat0Ids).toEqual([1, 3]);
        expect(cat1Ids).toEqual([2, 4]);
    });
});

// ─── applyRandomSeeding ───────────────────────────────────────────────────────

describe("applyRandomSeeding", () => {
    it("returns the same number of players", () => {
        const players = makePlayers(8);
        expect(applyRandomSeeding(players).length).toBe(8);
    });

    it("assigns seeds 1…N to all players", () => {
        const result = applyRandomSeeding(makePlayers(8));
        const seeds = result.map(p => p.seed).sort((a, b) => a - b);
        expect(seeds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("does not mutate the original array", () => {
        const players = makePlayers(4);
        const originalSeeds = players.map(p => p.seed);
        applyRandomSeeding(players);
        expect(players.map(p => p.seed)).toEqual(originalSeeds);
    });
});
