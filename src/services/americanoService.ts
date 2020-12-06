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
    array.forEach((player) => {
        player.id = id;
        id++;
    });
}

export function prepareGames(
    players: PadelPlayer[],
    randomSchedule: boolean
): PadelGame[] {
    const padelGames: PadelGame[] = [];

    if (randomSchedule) {
        shuffleArray(players);
        resetIds(players);
    }

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
        }
    );

    return padelGames;
}
