import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer, PreferredSide } from "../models/padelPlayer.interface";

export function getPadelPlayers(amount = 8): PadelPlayer[] {
    const padelPlayers: PadelPlayer[] = [];

    for (let i = 0; i < amount; i++) {
        const padelPlayer: PadelPlayer = {
            name: "",
            score: 0,
            id: i + 1,
            preferredSide: "Both",
            seed: i + 1,
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

function chooseSides(
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

function setPlayerSides(game: PadelGame, allPlayers: PadelPlayer[]) {
    const homePlayers = game.players.filter(p => p.home);
    const awayPlayers = game.players.filter(p => !p.home);

    const h1 = allPlayers.find(p => p.id === homePlayers[0].playerId);
    const h2 = allPlayers.find(p => p.id === homePlayers[1].playerId);
    const a1 = allPlayers.find(p => p.id === awayPlayers[0].playerId);
    const a2 = allPlayers.find(p => p.id === awayPlayers[1].playerId);

    if (h1 && h2) {
        const [s1, s2] = chooseSides(h1, h2);
        homePlayers[0].side = s1;
        homePlayers[1].side = s2;
    }

    if (a1 && a2) {
        const [s3, s4] = chooseSides(a1, a2);
        awayPlayers[0].side = s3;
        awayPlayers[1].side = s4;
    }
}

function resetIds(array: PadelPlayer[]) {
    let id = 1;
    array.forEach(player => {
        player.id = id;
        id++;
    });
}

function setupGamesWithPlayers(
    players: PadelPlayer[],
    playGroup = 1
): PadelGame[] {
    const padelGames: PadelGame[] = [];

    padelGames.push(
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[0].id,
                    home: true,
                },
                {
                    playerId: players[1].id,
                    home: true,
                },
                {
                    playerId: players[2].id,
                    home: false,
                },
                {
                    playerId: players[3].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 1,
            id: 1,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[4].id,
                    home: true,
                },
                {
                    playerId: players[5].id,
                    home: true,
                },
                {
                    playerId: players[6].id,
                    home: false,
                },
                {
                    playerId: players[7].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 1,
            id: 2,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[0].id,
                    home: true,
                },
                {
                    playerId: players[2].id,
                    home: true,
                },
                {
                    playerId: players[4].id,
                    home: false,
                },
                {
                    playerId: players[6].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 2,
            id: 3,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[1].id,
                    home: true,
                },
                {
                    playerId: players[3].id,
                    home: true,
                },
                {
                    playerId: players[5].id,
                    home: false,
                },
                {
                    playerId: players[7].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 2,
            id: 4,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[0].id,
                    home: true,
                },
                {
                    playerId: players[4].id,
                    home: true,
                },
                {
                    playerId: players[1].id,
                    home: false,
                },
                {
                    playerId: players[5].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 3,
            id: 5,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[2].id,
                    home: true,
                },
                {
                    playerId: players[6].id,
                    home: true,
                },
                {
                    playerId: players[3].id,
                    home: false,
                },
                {
                    playerId: players[7].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 3,
            id: 6,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[2].id,
                    home: true,
                },
                {
                    playerId: players[4].id,
                    home: true,
                },
                {
                    playerId: players[1].id,
                    home: false,
                },
                {
                    playerId: players[7].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 4,
            id: 7,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[3].id,
                    home: true,
                },
                {
                    playerId: players[5].id,
                    home: true,
                },
                {
                    playerId: players[0].id,
                    home: false,
                },
                {
                    playerId: players[6].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 4,
            id: 8,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[4].id,
                    home: true,
                },
                {
                    playerId: players[7].id,
                    home: true,
                },
                {
                    playerId: players[0].id,
                    home: false,
                },
                {
                    playerId: players[3].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 5,
            id: 9,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[1].id,
                    home: true,
                },
                {
                    playerId: players[2].id,
                    home: true,
                },
                {
                    playerId: players[5].id,
                    home: false,
                },
                {
                    playerId: players[6].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 5,
            id: 10,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[0].id,
                    home: true,
                },
                {
                    playerId: players[7].id,
                    home: true,
                },
                {
                    playerId: players[1].id,
                    home: false,
                },
                {
                    playerId: players[6].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 6,
            id: 11,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[3].id,
                    home: true,
                },
                {
                    playerId: players[4].id,
                    home: true,
                },
                {
                    playerId: players[2].id,
                    home: false,
                },
                {
                    playerId: players[5].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 6,
            id: 12,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[2].id,
                    home: true,
                },
                {
                    playerId: players[7].id,
                    home: true,
                },
                {
                    playerId: players[0].id,
                    home: false,
                },
                {
                    playerId: players[5].id,
                    home: false,
                },
            ],
            matchNumber: 1,
            round: 7,
            id: 13,
            playGroup,
        },
        {
            homeScore: null,
            awayScore: null,
            players: [
                {
                    playerId: players[3].id,
                    home: true,
                },
                {
                    playerId: players[6].id,
                    home: true,
                },
                {
                    playerId: players[1].id,
                    home: false,
                },
                {
                    playerId: players[4].id,
                    home: false,
                },
            ],
            matchNumber: 2,
            round: 7,
            id: 14,
            playGroup,
        }
    );

    padelGames.forEach(game => setPlayerSides(game, players));

    return padelGames;
}

function mergeAlternating(array1: Array<any>, array2: Array<any>) {
    const mergedArray = [];

    for (
        let i = 0, len = Math.max(array1.length, array2.length);
        i < len;
        i++
    ) {
        if (i < array1.length) {
            mergedArray.push(array1[i]);
        }
        if (i < array2.length) {
            mergedArray.push(array2[i]);
        }
    }
    return mergedArray;
}

function splitArrayInHalf(array: Array<any>): Array<any>[] {
    const middle = Math.ceil(array.length / 2);

    const leftArray = array.slice(0, middle);
    const rightArray = array.slice(middle);

    return [leftArray, rightArray];
}

function playersCanTeam(p1: PadelPlayer, p2: PadelPlayer): boolean {
    if (p1.preferredSide === "Both" || p2.preferredSide === "Both") return true;
    return p1.preferredSide !== p2.preferredSide;
}

function pairTeams(group: PadelPlayer[]): [PadelPlayer[], PadelPlayer[]] {
    const arr = [...group];
    for (let i = 0; i < 10; i++) {
        shuffleArray(arr);
        if (playersCanTeam(arr[0], arr[1]) && playersCanTeam(arr[2], arr[3])) {
            return [arr.slice(0, 2), arr.slice(2, 4)];
        }
    }
    return [arr.slice(0, 2), arr.slice(2, 4)];
}

function generateRandomGames(players: PadelPlayer[]): PadelGame[] {
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
        shuffleArray(activePlayers);

        for (let i = 0; i < activePlayers.length; i += 4) {
            const group = activePlayers.slice(i, i + 4);
            if (group.length < 4) {
                group.forEach(p => {
                    games.push({
                        homeScore: null,
                        awayScore: null,
                        players: [
                            { playerId: p.id, home: true, side: "Left" },
                        ],
                        matchNumber: 0,
                        round: r,
                        id: games.length + 1,
                        playGroup: 1,
                    });
                });
                continue;
            }

            const [team1, team2] = pairTeams(group);
            const [s1, s2] = chooseSides(team1[0], team1[1]);
            const [s3, s4] = chooseSides(team2[0], team2[1]);

            games.push({
                homeScore: null,
                awayScore: null,
                players: [
                    { playerId: team1[0].id, home: true, side: s1 },
                    { playerId: team1[1].id, home: true, side: s2 },
                    { playerId: team2[0].id, home: false, side: s3 },
                    { playerId: team2[1].id, home: false, side: s4 },
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
    players: PadelPlayer[],
    randomSchedule: boolean
): PadelGame[] {
    if (randomSchedule) {
        shuffleArray(players);
        resetIds(players);
    }

    if (players.length !== 8 && players.length !== 16) {
        return generateRandomGames(players);
    }

    if (players.length === 16) {
        const arrays = splitArrayInHalf(players);

        const games1 = setupGamesWithPlayers(arrays[0]);
        const games2 = setupGamesWithPlayers(arrays[1], 2);
        const combinedGames = mergeAlternating(games1, games2);
        return combinedGames;
    }

    return setupGamesWithPlayers(players);
}

export function getColorCodeGroupFromPlayer(
    player: PadelPlayer,
    players: PadelPlayer[] | readonly PadelPlayer[],
    games: PadelGame[] | readonly PadelGame[]
) {
    const gameWithPlayer = games.find(game => {
        const playerIncluded = game.players.find(p => p.playerId === player.id);

        if (playerIncluded) {
            return game;
        }
    });

    return gameWithPlayer?.playGroup;
}

export function allNamesAreEmpty(players: PadelPlayer[]) {
    const namedPlayers = players.filter(player => player.name !== "");
    return namedPlayers.length === 0;
}
