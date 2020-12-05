import { PadelGame } from "./padelGame.interface";
import { PadelPlayer } from "./padelPlayer.interface";
import { PadelRules } from "./padelRules.interface";

export interface FullAmericanoState {
    players: PadelPlayer[];
    games: PadelGame[];
    step: number;
    rules: PadelRules;
}
