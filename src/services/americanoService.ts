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

    // TODO: Recreate padel games to have players instead of home/away so one can easily filter.

    padelGames.push(
        {
            home: { player1: players[0], player2: players[1], score: 0 },
            away: { player1: players[2], player2: players[3], score: 0 },
            matchNumber: 1,
            round: 1,
            id: 1,
        },
        {
            home: { player1: players[4], player2: players[5], score: 0 },
            away: { player1: players[6], player2: players[7], score: 0 },
            matchNumber: 2,
            round: 1,
            id: 2,
        },
        {
            home: { player1: players[0], player2: players[2], score: 0 },
            away: { player1: players[4], player2: players[6], score: 0 },
            matchNumber: 1,
            round: 2,
            id: 3,
        },
        {
            home: { player1: players[1], player2: players[3], score: 0 },
            away: { player1: players[5], player2: players[7], score: 0 },
            matchNumber: 2,
            round: 2,
            id: 4,
        },
        {
            home: { player1: players[0], player2: players[4], score: 0 },
            away: { player1: players[1], player2: players[5], score: 0 },
            matchNumber: 1,
            round: 3,
            id: 5,
        },
        {
            home: { player1: players[2], player2: players[6], score: 0 },
            away: { player1: players[3], player2: players[7], score: 0 },
            matchNumber: 2,
            round: 3,
            id: 6,
        },
        {
            home: { player1: players[2], player2: players[4], score: 0 },
            away: { player1: players[1], player2: players[7], score: 0 },
            matchNumber: 1,
            round: 4,
            id: 7,
        },
        {
            home: { player1: players[3], player2: players[5], score: 0 },
            away: { player1: players[0], player2: players[6], score: 0 },
            matchNumber: 2,
            round: 4,
            id: 8,
        },
        {
            home: { player1: players[4], player2: players[7], score: 0 },
            away: { player1: players[0], player2: players[3], score: 0 },
            matchNumber: 1,
            round: 5,
            id: 9,
        },
        {
            home: { player1: players[1], player2: players[2], score: 0 },
            away: { player1: players[5], player2: players[6], score: 0 },
            matchNumber: 2,
            round: 5,
            id: 10,
        },
        {
            home: { player1: players[0], player2: players[7], score: 0 },
            away: { player1: players[1], player2: players[6], score: 0 },
            matchNumber: 1,
            round: 6,
            id: 11,
        },
        {
            home: { player1: players[3], player2: players[4], score: 0 },
            away: { player1: players[2], player2: players[5], score: 0 },
            matchNumber: 2,
            round: 6,
            id: 12,
        },
        {
            home: { player1: players[2], player2: players[7], score: 0 },
            away: { player1: players[0], player2: players[5], score: 0 },
            matchNumber: 1,
            round: 7,
            id: 13,
        },
        {
            home: { player1: players[3], player2: players[6], score: 0 },
            away: { player1: players[1], player2: players[4], score: 0 },
            matchNumber: 2,
            round: 7,
            id: 14,
        }
    );

    return padelGames;
}
