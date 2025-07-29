export type GameMode = "Americano" | "Mexicano";

export interface PadelRules {
    maxScore: number;
    randomSchedule: boolean;
    amountOfPlayers: number;
    colorCode: boolean;
    courtNames: string[];
    mode: GameMode;
}
