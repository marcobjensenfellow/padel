import { reactive } from "vue";

export type Locale = "en" | "da";
const STORAGE_KEY = "padel_locale";

function detectLocale(): Locale {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "en" || saved === "da") return saved as Locale;
        const lang = (navigator.language || "").toLowerCase();
        return lang.startsWith("da") ? "da" : "en";
    } catch {
        return "en";
    }
}

export const i18nState = reactive({ locale: detectLocale() });

export function setLocale(lang: Locale): void {
    i18nState.locale = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
}

type Messages = Record<string, string>;
const messages: Record<Locale, Messages> = {
    en: {
        // Nav
        app_title: "Padel",
        // AddPlayers
        new_tournament: "New tournament",
        set_up_game: "Set up your game",
        tournament_name_placeholder: "e.g. Friday session",
        game_format: "GAME FORMAT",
        shuffle_draw: "Shuffle draw",
        prefer_sides: "Respect preferred sides",
        rules: "RULES",
        max_points_round: "Points per round",
        number_of_players: "Players",
        colour_code_groups: "Colour code groups",
        court_label: "Court {n}",
        players: "PLAYERS",
        autofill: "Autofill",
        demo: "Demo",
        player_n: "Player {n}",
        duplicate_names_error: "Some names are duplicated",
        max_score_error: "Points must be a number greater than 0",
        reset: "Reset",
        go_to_matches: "Go to matches",
        start_tournament: "Start tournament",
        seeding: "Seeding",
        seeding_random: "Random",
        // ShowGames
        round_n: "Round {n}",
        matches_scored: "{done}/{total} matches scored",
        sitting_out: "Sitting out",
        nav_setup: "← Setup",
        end_tournament: "End tournament",
        see_results: "See results →",
        score_all_first: "Score all matches first",
        // ShowGames confirm
        end_confirm_title: "End tournament?",
        end_confirm_body: "All progress will be lost.",
        end_confirm_yes: "Yes, end it",
        end_confirm_cancel: "Cancel",
        // ShowScore
        standings: "Standings",
        round_of: "Round {current} of {total}",
        final_standings: "Final standings",
        current_standings: "Current standings",
        group_a: "Group A",
        group_b: "Group B",
        show_combined: "Show combined",
        show_by_group: "Show by group",
        next_round: "Next round →",
        back_to_matches: "← Back to matches",
        end_early: "End tournament",
        end_early_title: "End tournament early?",
        round_remaining: "{n} round remaining. Current standings will be the final result.",
        rounds_remaining: "{n} rounds remaining. Current standings will be the final result.",
        yes_end: "Yes, end here",
        keep_playing: "Keep playing",
        // ScorePicker
        points_for: "POINTS FOR",
        gets_the_rest: "gets the rest",
        // AddPlayers stepper
        back_home: "Home",
        sit_out_hint: "{n} sit out / round",
        // ShowGames secondary CTA
        see_results_plain: "See results",
        // Home / landing
        home_headline: "Padel",
        home_subheadline: "Americano & Mexicano",
        home_tagline: "The easiest way to run your padel tournament — no login, no ads.",
        home_cta: "Start tournament",
        home_resume: "Continue tournament",
        home_new_tournament: "New tournament",
        home_continue: "Continue tournament →",
        home_americano_desc: "Random draw · everyone plays everyone",
        home_mexicano_desc: "Adaptive seeding · best plays best",
        home_pick_format: "Pick a format to get started",
        home_or_continue: "or continue where you left off",
        home_hero_headline: "Start a padel tournament in 10 seconds",
        home_headline_sub: "The easiest way to run your padel tournament — no account, no ads.",
        home_americano_desc_long: "Simple format. Everyone plays everyone.",
        home_mexicano_desc_long: "Dynamic format. Best plays best.",
        home_start_new: "Start new tournament",
        home_last_format: "Last used format: {format}",
        home_format_section: "Choose format",
        home_format_most_popular: "Most popular",
        home_format_selected: "Selected",
        home_format_how: "How it works",
        home_mexicano_feat1: "Automatic seeding",
        home_mexicano_feat2: "Rotates players",
        home_mexicano_feat3: "Balanced matches",
        home_tournaments_section: "Your tournaments",
        home_tournaments_empty: "No tournaments yet. Start your first one above!",
        history_continue_cta: "Continue",
        history_details_cta: "View details",
        history_next_round: "Next: Round {n} of {total}",
        history_rounds_done: "Round {n} of {total} completed",
        home_feat1_title: "Intelligent seeding",
        home_feat1_body: "Random draw, exact drag-and-drop, or tier categories. Copy a previous tournament to seed directly from those results.",
        home_feat2_title: "Preferred sides",
        home_feat2_body: "Automatically honours each player's left or right side preference when building teams.",
        home_feat3_title: "Auto-saves",
        home_feat3_body: "Your tournament is saved locally. Close the app and pick up exactly where you left off — no login needed.",
        home_feat4_title: "Handles sit-outs",
        home_feat4_body: "Odd player counts? No problem. The app automatically rotates who sits out each round.",
        // History
        history_title: "Tournament history",
        history_empty: "No completed tournaments yet.",
        history_ongoing: "Ongoing",
        history_completed: "Completed",
        history_rounds: "Round {n} of {total}",
        history_players: "{n} players",
        history_winner: "Winner",
        history_copy: "Copy with seeding",
        history_copy_confirm: "Start a new tournament with these players seeded from their final ranking?",
        history_resume_btn: "Continue tournament",
        history_not_current: "This tournament is no longer the active game.",
        // Seeding (also declared inline above near seeding_random)
        seeding_exact: "Exact",
        seeding_category: "Category",
        cat_0_of_2: "Top",
        cat_1_of_2: "Bottom",
        cat_0_of_3: "Top",
        cat_1_of_3: "Middle",
        cat_2_of_3: "Bottom",
        cat_0_of_4: "Top",
        cat_1_of_4: "Upper",
        cat_2_of_4: "Lower",
        cat_3_of_4: "Bottom",
        cat_0_of_5: "Top",
        cat_1_of_5: "Upper",
        cat_2_of_5: "Middle",
        cat_3_of_5: "Lower",
        cat_4_of_5: "Bottom",
    },
    da: {
        // Nav
        app_title: "Padel",
        // AddPlayers
        new_tournament: "Ny turnering",
        set_up_game: "Opsæt dit spil",
        tournament_name_placeholder: "f.eks. Fredagssession",
        game_format: "SPILFORMAT",
        shuffle_draw: "Tilfældig lodtrækning",
        prefer_sides: "Respekter foretrukne side",
        rules: "REGLER",
        max_points_round: "Point pr. runde",
        number_of_players: "Spillere",
        colour_code_groups: "Farvekode grupper",
        court_label: "Bane {n}",
        players: "SPILLERE",
        autofill: "Autoudfyld",
        demo: "Demo",
        player_n: "Spiller {n}",
        duplicate_names_error: "Nogle navne er duplikerede",
        max_score_error: "Maks point skal være et tal større end 0",
        reset: "Nulstil",
        go_to_matches: "Gå til kampe",
        start_tournament: "Start turnering",
        seeding: "Seedning",
        seeding_random: "Tilfældig",
        // ShowGames
        round_n: "Runde {n}",
        matches_scored: "{done}/{total} kampe scoret",
        sitting_out: "Sidder ude",
        nav_setup: "← Opsætning",
        end_tournament: "Afslut turnering",
        see_results: "Se resultater →",
        score_all_first: "Score alle kampe først",
        // ShowGames confirm
        end_confirm_title: "Afslut turnering?",
        end_confirm_body: "Al fremskridt vil gå tabt.",
        end_confirm_yes: "Ja, afslut",
        end_confirm_cancel: "Annuller",
        // ShowScore
        standings: "Stilling",
        round_of: "Runde {current} af {total}",
        final_standings: "Slutstilling",
        current_standings: "Aktuel stilling",
        group_a: "Gruppe A",
        group_b: "Gruppe B",
        show_combined: "Vis samlet",
        show_by_group: "Vis pr. gruppe",
        next_round: "Næste runde →",
        back_to_matches: "← Tilbage til kampe",
        end_early: "Afslut turnering",
        end_early_title: "Afslutte turneringen tidligt?",
        round_remaining: "{n} runde tilbage. Aktuel stilling vil være slutresultatet.",
        rounds_remaining: "{n} runder tilbage. Aktuel stilling vil være slutresultatet.",
        yes_end: "Ja, afslut her",
        keep_playing: "Fortsæt spillet",
        // ScorePicker
        points_for: "POINT TIL",
        gets_the_rest: "får resten",
        // AddPlayers stepper
        back_home: "Forside",
        sit_out_hint: "{n} sidder over / runde",
        // ShowGames secondary CTA
        see_results_plain: "Se resultater",
        // Home / landing
        home_headline: "Padel",
        home_subheadline: "Americano & Mexicano",
        home_tagline: "Den nemmeste måde at afvikle din padel turnering — ingen konto, ingen reklamer.",
        home_cta: "Start turnering",
        home_resume: "Fortsæt turnering",
        home_new_tournament: "Ny turnering",
        home_continue: "Fortsæt turnering →",
        home_americano_desc: "Tilfældig lodtrækning · alle spiller mod alle",
        home_mexicano_desc: "Adaptiv seeding · bedste spiller mod bedste",
        home_pick_format: "Vælg format for at komme i gang",
        home_or_continue: "eller fortsæt hvor du slap",
        home_hero_headline: "Start en padel turnering på 10 sekunder",
        home_headline_sub: "Den nemmeste måde at afvikle din padelturnering — ingen konto, ingen reklamer.",
        home_americano_desc_long: "Simpelt format. Alle spiller mod alle.",
        home_mexicano_desc_long: "Dynamisk format. Bedste spiller mod bedste.",
        home_start_new: "Start ny turnering",
        home_last_format: "Sidst brugte format: {format}",
        home_format_section: "Vælg format",
        home_format_most_popular: "Mest brugt",
        home_format_selected: "Valgt",
        home_format_how: "Sådan bruges format",
        home_mexicano_feat1: "Automatisk seeding",
        home_mexicano_feat2: "Roterer spillere",
        home_mexicano_feat3: "Balancerede kampe",
        home_tournaments_section: "Dine turneringer",
        home_tournaments_empty: "Ingen turneringer endnu. Start din første ovenfor!",
        history_continue_cta: "Fortsæt",
        history_details_cta: "Se detaljer",
        history_next_round: "Næste: Runde {n} af {total}",
        history_rounds_done: "Runde {n} af {total} afsluttet",
        home_feat1_title: "Intelligent seeding",
        home_feat1_body: "Tilfældig lodtrækning, præcis træk-og-slip eller kategoritrin. Kopier en tidligere turnering og brug dens rangering som udgangspunkt.",
        home_feat2_title: "Foretrukne sider",
        home_feat2_body: "Respekterer automatisk om en spiller foretrækker venstre eller højre side, når holdene sammensættes.",
        home_feat3_title: "Gemmes automatisk",
        home_feat3_body: "Turneringen gemmes lokalt. Luk appen og fortsæt præcis, hvor du slap — ingen konto nødvendig.",
        home_feat4_title: "Håndterer oversiddere",
        home_feat4_body: "Ulige antal spillere? Intet problem. Appen roterer automatisk hvem der sidder over i hver runde.",
        // History
        history_title: "Turneringshistorik",
        history_empty: "Ingen afholdte turneringer endnu.",
        history_ongoing: "I gang",
        history_completed: "Afsluttet",
        history_rounds: "Runde {n} af {total}",
        history_players: "{n} spillere",
        history_winner: "Vinder",
        history_copy: "Kopier med seeding",
        history_copy_confirm: "Start en ny turnering med disse spillere seedet ud fra deres slutplacering?",
        history_resume_btn: "Fortsæt turnering",
        history_not_current: "Denne turnering er ikke det aktuelle spil.",
        // Seeding
        seeding_exact: "Eksakt",
        seeding_category: "Kategori",
        cat_0_of_2: "Top",
        cat_1_of_2: "Bund",
        cat_0_of_3: "Top",
        cat_1_of_3: "Midt",
        cat_2_of_3: "Bund",
        cat_0_of_4: "Top",
        cat_1_of_4: "Øvre",
        cat_2_of_4: "Nedre",
        cat_3_of_4: "Bund",
        cat_0_of_5: "Top",
        cat_1_of_5: "Øvre",
        cat_2_of_5: "Midt",
        cat_3_of_5: "Nedre",
        cat_4_of_5: "Bund",
    },
};

export function t(key: string, params?: Record<string, string | number>): string {
    const locale = i18nState.locale;
    let str = messages[locale][key] ?? messages["en"][key] ?? key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            str = str.replace(`{${k}}`, String(v));
        }
    }
    return str;
}
