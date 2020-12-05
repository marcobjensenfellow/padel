import { PadelGame } from "./padelGame.interface";
import { PadelPlayer } from "./padelPlayer.interface";

export interface FullAmericanoState {
    players: PadelPlayer[];
    games: PadelGame[];
    step: number;
}
