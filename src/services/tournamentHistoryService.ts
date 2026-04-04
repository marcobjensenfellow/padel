const HISTORY_KEY = "padel_tournament_history_v1";

export interface HistoryPlayer {
    name: string;
    score: number;
}

export interface TournamentSummary {
    id: string;
    name: string;
    savedAt: string;          // ISO date string
    format: string;           // "Americano" | "Mexicano"
    numPlayers: number;
    roundsPlayed: number;
    totalRounds: number;
    completed: boolean;
    top3: HistoryPlayer[];
    players: HistoryPlayer[];  // all players sorted by final score (for copy-with-seeding)
}

function load(): TournamentSummary[] {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function save(list: TournamentSummary[]): void {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch {
        // localStorage full or unavailable — fail silently
    }
}

export function getHistory(): TournamentSummary[] {
    return load();
}

export function upsertToHistory(entry: TournamentSummary): void {
    const list = load();
    const idx = list.findIndex(h => h.id === entry.id);
    if (idx >= 0) {
        list[idx] = entry;
    } else {
        list.unshift(entry);
    }
    // Keep at most 100 entries
    save(list.slice(0, 100));
}

export function removeFromHistory(id: string): void {
    save(load().filter(h => h.id !== id));
}
