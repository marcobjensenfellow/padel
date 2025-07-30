import { FullAmericanoState } from "@/models/fullAmericanoState.interface";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { PadelRules } from "@/models/padelRules.interface";

const _tournaments = "fullAmericanoTournaments";
const _currentTournament = "currentAmericanoTournament";

function loadTournaments(): Record<string, FullAmericanoState> {
    const loaded = localStorage.getItem(_tournaments);
    return loaded ? JSON.parse(loaded) : {};
}

export function getTournamentNames(): string[] {
    return Object.keys(loadTournaments());
}

export function getCurrentTournamentName(): string | null {
    return localStorage.getItem(_currentTournament);
}

export function setCurrentTournamentName(name: string): void {
    localStorage.setItem(_currentTournament, name);
}

export function saveAmericanoState(
    players: PadelPlayer[],
    games: PadelGame[],
    step: number,
    rules: PadelRules,
    round: number,
    name: string
): void {
    const saveObject: FullAmericanoState = {
        players,
        games,
        step,
        rules,
        round,
    };

    const tournaments = loadTournaments();
    tournaments[name] = saveObject;
    localStorage.setItem(_tournaments, JSON.stringify(tournaments));
    localStorage.setItem(_currentTournament, name);
}

export function loadAmericanoState(name?: string): FullAmericanoState | null {
    if (!name) {
        name = localStorage.getItem(_currentTournament) || undefined;
    }

    if (!name) {
        return null;
    }

    const tournaments = loadTournaments();
    return tournaments[name] || null;
}

export function removeAmericanoState(name: string): void {
    const tournaments = loadTournaments();
    delete tournaments[name];
    localStorage.setItem(_tournaments, JSON.stringify(tournaments));

    const current = localStorage.getItem(_currentTournament);
    if (current === name) {
        localStorage.removeItem(_currentTournament);
    }
}
