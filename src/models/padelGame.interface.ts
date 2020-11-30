import { PadelPlayer } from "./padelPlayer.interface";

export interface PadelGame {
    round: number;
    matchNumber: number;
    id: number;
    home: {
        player1: PadelPlayer;
        player2: PadelPlayer;
        score: number;
    };
    away: {
        player1: PadelPlayer;
        player2: PadelPlayer;
        score: number;
    };
}
