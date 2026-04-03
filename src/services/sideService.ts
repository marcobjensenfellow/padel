import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";

/**
 * Assigns sides to two teammates based on their preferred sides.
 * If both prefer the same side, the first player "wins" and the
 * second player gets the other side.
 */
export function chooseSides(
    first: PadelPlayer,
    second: PadelPlayer
): [PreferredSide, PreferredSide] {
    if (first.preferredSide === "Left" && second.preferredSide !== "Left") {
        return ["Left", "Right"];
    }
    if (second.preferredSide === "Left" && first.preferredSide !== "Left") {
        return ["Right", "Left"];
    }
    if (first.preferredSide === "Right" && second.preferredSide !== "Right") {
        return ["Right", "Left"];
    }
    if (second.preferredSide === "Right" && first.preferredSide !== "Right") {
        return ["Left", "Right"];
    }
    return ["Left", "Right"];
}

/**
 * Returns true if two players can be on the same team without
 * both insisting on the same fixed side.
 */
export function playersCanTeam(p1: PadelPlayer, p2: PadelPlayer): boolean {
    if (p1.preferredSide === "Both" || p2.preferredSide === "Both") return true;
    return p1.preferredSide !== p2.preferredSide;
}

/**
 * Given a group of exactly 4 players (sorted by score/seed for Mexicano,
 * or randomly for Americano), tries to form two compatible teams.
 * Falls back to the natural order if no compatible split is found.
 */
export function pairTeams(
    group: PadelPlayer[]
): [PadelPlayer[], PadelPlayer[]] {
    const arr = [...group];
    // Try shuffled arrangements (Americano random) — for Mexicano we
    // pass pre-sorted players so we do fewer attempts to preserve ranking.
    for (let i = 0; i < 10; i++) {
        if (playersCanTeam(arr[0], arr[1]) && playersCanTeam(arr[2], arr[3])) {
            return [arr.slice(0, 2), arr.slice(2, 4)];
        }
        // Rotate: try [0,2] vs [1,3], then [0,3] vs [1,2]
        const swaps: [number, number][] = [
            [1, 2],
            [1, 3],
            [2, 3],
        ];
        const swap = swaps[i % swaps.length];
        [arr[swap[0]], arr[swap[1]]] = [arr[swap[1]], arr[swap[0]]];
    }
    return [arr.slice(0, 2), arr.slice(2, 4)];
}

/**
 * For Mexicano: given 4 players ranked #1–#4 (index 0–3),
 * pairs them so that side preferences are honoured while keeping
 * roughly equal match strength. Preferred pairing: 1&4 vs 2&3
 * (standard Mexicano). Falls back to 1&2 vs 3&4 if needed.
 */
export function pairMexicanoTeams(
    group: PadelPlayer[]
): [PadelPlayer[], PadelPlayer[]] {
    // Standard Mexicano: #1&#4 vs #2&#3
    const candidates: [PadelPlayer[], PadelPlayer[]][] = [
        [[group[0], group[3]], [group[1], group[2]]],
        [[group[0], group[2]], [group[1], group[3]]],
        [[group[0], group[1]], [group[2], group[3]]],
    ];
    for (const [t1, t2] of candidates) {
        if (playersCanTeam(t1[0], t1[1]) && playersCanTeam(t2[0], t2[1])) {
            return [t1, t2];
        }
    }
    // Last resort — ignore side conflict
    return [candidates[0][0], candidates[0][1]];
}
