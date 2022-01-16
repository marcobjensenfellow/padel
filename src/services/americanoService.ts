import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "../models/padelPlayer.interface";

export function getPadelPlayers(amount = 8): PadelPlayer[] {
    const padelPlayers: PadelPlayer[] = [];

    for (let i = 0; i < amount; i++) {
        const padelPlayer: PadelPlayer = { name: "", score: 0, id: i + 1 };
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

export function prepareGames(
    players: PadelPlayer[],
    randomSchedule: boolean
): PadelGame[] {
    if (randomSchedule) {
        shuffleArray(players);
        resetIds(players);
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
