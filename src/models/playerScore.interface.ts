import { PreferredSide } from "./padelPlayer.interface";

export interface PlayerScore {
    playerId: number;
    home: boolean;
    side?: PreferredSide;
}
