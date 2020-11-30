import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "../models/padelPlayer.interface";

const padelPlayers: PadelPlayer[] = [
    { name: "", score: 0, id: 1 },
    { name: "", score: 0, id: 2 },
    { name: "", score: 0, id: 3 },
    { name: "", score: 0, id: 4 },
    { name: "", score: 0, id: 5 },
    { name: "", score: 0, id: 6 },
    { name: "", score: 0, id: 7 },
    { name: "", score: 0, id: 8 },
];

export function getPadelPlayers(): PadelPlayer[] {
    return padelPlayers;
}

export function prepareGames(players: PadelPlayer[]): PadelGame[] {
    const padelGames: PadelGame[] = [];

    padelGames.push(
        {
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
            homeScore: 0,
            awayScore: 0,
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
