import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { balancePlayerSides } from "./americanoService";
import { pairMexicanoTeams } from "./sideService";

/**
 * Generates the next Mexicano round.
 *
 * Players are sorted by score (descending), with seed as tiebreaker —
 * so round 1 uses the initial seeding directly.
 *
 * Teams are paired using pairMexicanoTeams which:
 *   1. Prefers the standard Mexicano pairing: #1&#4 vs #2&#3
 *   2. Falls back to alternatives that still respect preferred sides
 */
export function prepareMexicanoRound(
    players: PadelPlayer[],
    round: number
): PadelGame[] {
    const sorted = [...players].sort((a, b) => {
        if (a.score === b.score) return a.seed - b.seed;
        return b.score - a.score;
    });

    const games: PadelGame[] = [];

    for (let i = 0; i < sorted.length; i += 4) {
        const group = sorted.slice(i, i + 4);

        if (group.length < 4) {
            group.forEach(p => {
                games.push({
                    homeScore: null,
                    awayScore: null,
                    players: [{ playerId: p.id, home: true, side: "Left" }],
                    matchNumber: 0,
                    round,
                    id: games.length + 1,
                    playGroup: 1,
                });
            });
            continue;
        }

        // Smart pairing: tries #1&#4 vs #2&#3 first, respects side preferences
        const [team1, team2] = pairMexicanoTeams(group);

        // Placeholder sides — balancePlayerSides sets the final values below
        games.push({
            homeScore: null,
            awayScore: null,
            players: [
                { playerId: team1[0].id, home: true, side: "Left" },
                { playerId: team1[1].id, home: true, side: "Right" },
                { playerId: team2[0].id, home: false, side: "Left" },
                { playerId: team2[1].id, home: false, side: "Right" },
            ],
            matchNumber: Math.floor(i / 4) + 1,
            round,
            id: games.length + 1,
            playGroup: 1,
        });
    }

    // Single authoritative side-assignment pass
    balancePlayerSides(games, players);

    return games;
}

export function totalRounds(amountOfPlayers: number): number {
    return amountOfPlayers - 1;
}

/**
 * Returns the number of seed categories for a given player count:
 *   8  players → 2 (Top / Bottom)
 *   16 players → 3 (Top / Middle / Bottom)
 *   24 players → 4
 *   32+ players → 5 (max)
 */
export function numCategoriesForPlayers(count: number): number {
    return Math.min(5, Math.max(2, Math.floor(count / 8) + 1));
}

/**
 * Resolves category-based seeding into precise player seeds.
 * Players within the same category are randomly shuffled; categories
 * are ordered 0 (top) → N (bottom). Returns a new array with updated `seed`.
 */
export function applyCategorySeeding(players: PadelPlayer[]): PadelPlayer[] {
    const result: PadelPlayer[] = [];
    const maxCat = Math.max(...players.map(p => p.seedCategory ?? 0));

    for (let cat = 0; cat <= maxCat; cat++) {
        const group = players.filter(p => (p.seedCategory ?? 0) === cat);
        // Fisher-Yates shuffle within category
        for (let i = group.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [group[i], group[j]] = [group[j], group[i]];
        }
        result.push(...group);
    }

    return result.map((p, i) => ({ ...p, seed: i + 1 }));
}
