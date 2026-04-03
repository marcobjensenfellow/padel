export type GameMode = "Americano" | "Mexicano";
export type SeedingMode = "exact" | "category";

export interface PadelRules {
    maxScore: number;
    randomSchedule: boolean;
    amountOfPlayers: number;
    colorCode: boolean;
    courtNames: string[];
    mode: GameMode;
    seedingMode: SeedingMode;
}
