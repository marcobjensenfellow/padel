import { PadelPlayer } from "./padelPlayer.interface";
import { PlayerScore } from "./playerScore.interface";

export interface PadelGame {
    round: number;
    matchNumber: number;
    id: number;
    players: PlayerScore[];
    homeScore: number;
    awayScore: number;
}
