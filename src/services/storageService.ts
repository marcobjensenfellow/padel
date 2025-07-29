import { FullAmericanoState } from "@/models/fullAmericanoState.interface";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { PadelRules } from "@/models/padelRules.interface";

const _fullAmericanoState = "fullAmericanoState";

export function saveAmericanoState(
    players: PadelPlayer[],
    games: PadelGame[],
    step: number,
    rules: PadelRules,
    round: number
): void {
    const saveObject: FullAmericanoState = { players, games, step, rules, round };

    localStorage.setItem(_fullAmericanoState, JSON.stringify(saveObject));
}

export function loadAmericanoState(): FullAmericanoState | null {
    const loadedState = localStorage.getItem(_fullAmericanoState);

    if (loadedState === null) {
        return null;
    }

    return JSON.parse(loadedState);
}

export function removeAmericanoState(): void {
    localStorage.removeItem(_fullAmericanoState);
}
