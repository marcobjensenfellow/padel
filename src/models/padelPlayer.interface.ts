export type PreferredSide = "Left" | "Right" | "Both";

export interface PadelPlayer {
    name: string;
    score: number;
    id: number;
    preferredSide: PreferredSide;
}
