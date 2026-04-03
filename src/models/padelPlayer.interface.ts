export type PreferredSide = "Left" | "Right" | "Both";

export interface PadelPlayer {
    name: string;
    score: number;
    id: number;
    preferredSide: PreferredSide;
    seed: number;
    /** Category tier for category-based seeding (0=top, 1=second, ...) */
    seedCategory: number;
}
