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
