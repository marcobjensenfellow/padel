import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer, PreferredSide } from "../models/padelPlayer.interface";
import { chooseSides, playersCanTeam, pairTeams } from "./sideService";

export function getPadelPlayers(amount = 8): PadelPlayer[] {
    const padelPlayers: PadelPlayer[] = [];

    for (let i = 0; i < amount; i++) {
        const padelPlayer: PadelPlayer = {
            name: "",
            score: 0,
            id: i + 1,
            preferredSide: "Both",
            seed: i + 1,
            seedCategory: 0,
        };
        padelPlayers.push(padelPlayer);
    }

    return padelPlayers;
}

function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

interface SideCount {
    left: number;
    right: number;
}

function chooseBalancedSides(
    first: PadelPlayer,
    second: PadelPlayer,
    counts: Record<number, SideCount>
): [PreferredSide, PreferredSide] {
    const determineBothSide = (
        player: PadelPlayer,
        avoid?: PreferredSide
    ): PreferredSide => {
        const { left, right } = counts[player.id];
        let side: PreferredSide = left <= right ? "Left" : "Right";
        if (side === avoid) {
            side = side === "Left" ? "Right" : "Left";
        }
        return side;
    };

    let side1: PreferredSide;
    let side2: PreferredSide;

    if (first.preferredSide !== "Both" && second.preferredSide !== "Both") {
        if (first.preferredSide === second.preferredSide) {
            side1 = first.preferredSide;
            side2 = side1 === "Left" ? "Right" : "Left";
        } else {
            side1 = first.preferredSide;
            side2 = second.preferredSide;
        }
    } else if (first.preferredSide !== "Both") {
        side1 = first.preferredSide;
        side2 = determineBothSide(second, side1);
    } else if (second.preferredSide !== "Both") {
        side2 = second.preferredSide;
        side1 = determineBothSide(first, side2);
    } else {
        side1 = determineBothSide(first);
        side2 = determineBothSide(second, side1);
    }

    counts[first.id][side1 === "Left" ? "left" : "right"] += 1;
    counts[second.id][side2 === "Left" ? "left" : "right"] += 1;

    return [side1, side2];
}

export function balancePlayerSides(games: PadelGame[], players: PadelPlayer[]) {
    const counts: Record<number, SideCount> = {};
    players.forEach(p => {
        counts[p.id] = { left: 0, right: 0 };
    });

    const sortedGames = [...games].sort((a, b) => {
        if (a.round === b.round) return a.matchNumber - b.matchNumber;
        return a.round - b.round;
    });

    sortedGames.forEach(game => {
        if (game.players.length < 4) return;

        const homePlayers = game.players.filter(p => p.home);
        const awayPlayers = game.players.filter(p => !p.home);

        const h1 = players.find(p => p.id === homePlayers[0].playerId);
        const h2 = players.find(p => p.id === homePlayers[1].playerId);
        const a1 = players.find(p => p.id === awayPlayers[0].playerId);
        const a2 = players.find(p => p.id === awayPlayers[1].playerId);

        if (h1 && h2) {
            const [s1, s2] = chooseBalancedSides(h1, h2, counts);
            homePlayers[0].side = s1;
            homePlayers[1].side = s2;
        }
        if (a1 && a2) {
            const [s3, s4] = chooseBalancedSides(a1, a2, counts);
            awayPlayers[0].side = s3;
            awayPlayers[1].side = s4;
        }
    });
}

function resetIds(array: PadelPlayer[]) {
    let id = 1;
    array.forEach(player => {
        player.id = id++;
    });
}

// Hardcoded round-robin for exactly 8 players (7 rounds, 2 courts).
// Does NOT call balancePlayerSides — that is done once in prepareGames.
function setupGamesWithPlayers(
    players: PadelPlayer[],
    playGroup = 1
): PadelGame[] {
    const padelGames: PadelGame[] = [];

    const game = (
        id: number,
        round: number,
        matchNumber: number,
        h1: number,
        h2: number,
        a1: number,
        a2: number
    ): PadelGame => ({
        homeScore: null,
        awayScore: null,
        players: [
            { playerId: players[h1].id, home: true },
            { playerId: players[h2].id, home: true },
            { playerId: players[a1].id, home: false },
            { playerId: players[a2].id, home: false },
        ],
        matchNumber,
        round,
        id,
        playGroup,
    });

    padelGames.push(
        game(1,  1, 1, 0, 1, 2, 3),
        game(2,  1, 2, 4, 5, 6, 7),
        game(3,  2, 1, 0, 2, 4, 6),
        game(4,  2, 2, 1, 3, 5, 7),
        game(5,  3, 1, 0, 4, 1, 5),
        game(6,  3, 2, 2, 6, 3, 7),
        game(7,  4, 1, 2, 4, 1, 7),
        game(8,  4, 2, 3, 5, 0, 6),
        game(9,  5, 1, 4, 7, 0, 3),
        game(10, 5, 2, 1, 2, 5, 6),
        game(11, 6, 1, 0, 7, 1, 6),
        game(12, 6, 2, 3, 4, 2, 5),
        game(13, 7, 1, 2, 7, 0, 5),
        game(14, 7, 2, 3, 6, 1, 4)
    );

    return padelGames;
}

function mergeAlternating(array1: Array<any>, array2: Array<any>) {
    const mergedArray = [];
    for (
        let i = 0, len = Math.max(array1.length, array2.length);
        i < len;
        i++
    ) {
        if (i < array1.length) mergedArray.push(array1[i]);
        if (i < array2.length) mergedArray.push(array2[i]);
    }
    return mergedArray;
}

function splitArrayInHalf(array: Array<any>): Array<any>[] {
    const middle = Math.ceil(array.length / 2);
    return [array.slice(0, middle), array.slice(middle)];
}

function generateRandomGames(players: PadelPlayer[], randomSchedule = true): PadelGame[] {
    const games: PadelGame[] = [];
    const rounds = players.length;
    const oversidderCount = players.length % 4;
    const oversidderQueue = [...players];

    for (let r = 1; r <= rounds; r++) {
        const oversidders: PadelPlayer[] = [];
        for (let o = 0; o < oversidderCount; o++) {
            const player = oversidderQueue.shift();
            if (player) {
                oversidders.push(player);
                oversidderQueue.push(player);
            }
        }

        const activePlayers = players.filter(p => !oversidders.includes(p));
        if (randomSchedule) shuffleArray(activePlayers);

        for (let i = 0; i < activePlayers.length; i += 4) {
            const group = activePlayers.slice(i, i + 4);
            if (group.length < 4) {
                group.forEach(p => {
                    games.push({
                        homeScore: null,
                        awayScore: null,
                        players: [{ playerId: p.id, home: true, side: "Left" }],
                        matchNumber: 0,
                        round: r,
                        id: games.length + 1,
                        playGroup: 1,
                    });
                });
                continue;
            }

            // pairTeams respects preferredSide when shuffling teams
            const [team1, team2] = pairTeams(group);

            // Placeholder sides — balancePlayerSides sets the final values
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
                round: r,
                id: games.length + 1,
                playGroup: 1,
            });
        }

        oversidders.forEach(p => {
            games.push({
                homeScore: null,
                awayScore: null,
                players: [{ playerId: p.id, home: true, side: "Left" }],
                matchNumber: 0,
                round: r,
                id: games.length + 1,
                playGroup: 1,
            });
        });
    }

    return games;
}

export function prepareGames(
    playersInput: PadelPlayer[],
    randomSchedule: boolean
): PadelGame[] {
    // Work on a shallow copy to avoid mutating store state
    const players = [...playersInput];

    if (randomSchedule) {
        shuffleArray(players);
        resetIds(players);
    }

    let games: PadelGame[];

    if (players.length === 16) {
        const [first, second] = splitArrayInHalf(players);
        games = mergeAlternating(
            setupGamesWithPlayers(first),
            setupGamesWithPlayers(second, 2)
        );
    } else if (players.length === 8) {
        games = setupGamesWithPlayers(players);
    } else {
        games = generateRandomGames(players, randomSchedule);
    }

    // Single authoritative call — balances sides across all rounds at once
    balancePlayerSides(games, players);
    return games;
}

export function getColorCodeGroupFromPlayer(
    player: PadelPlayer,
    players: PadelPlayer[] | readonly PadelPlayer[],
    games: PadelGame[] | readonly PadelGame[]
) {
    const gameWithPlayer = games.find(game =>
        game.players.find(p => p.playerId === player.id)
    );
    return gameWithPlayer?.playGroup;
}

export function allNamesAreEmpty(players: PadelPlayer[]) {
    return players.filter(player => player.name !== "").length === 0;
}

export function getMaxRound(games: readonly PadelGame[]): number {
    if (games.length === 0) return 0;
    return Math.max(...games.map(g => g.round));
}

// Re-export so existing imports from americanoService still work
export { chooseSides, playersCanTeam };
