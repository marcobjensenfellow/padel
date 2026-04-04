import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";

/** Build a single player with sensible defaults. */
export function makePlayer(
    id: number,
    overrides: Partial<PadelPlayer> = {}
): PadelPlayer {
    return {
        id,
        name: `Player ${id}`,
        score: 0,
        preferredSide: "Both",
        seed: id,
        seedCategory: 0,
        ...overrides,
    };
}

/** Build N players in a row, ids 1…N. */
export function makePlayers(
    n: number,
    overrides: Partial<PadelPlayer> = {}
): PadelPlayer[] {
    return Array.from({ length: n }, (_, i) => makePlayer(i + 1, overrides));
}

/** Build N players whose scores descend: player 1 has the highest score. */
export function makeRankedPlayers(n: number): PadelPlayer[] {
    return Array.from({ length: n }, (_, i) =>
        makePlayer(i + 1, { score: (n - i) * 10 })
    );
}
