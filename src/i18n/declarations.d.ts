import { Locale, i18nState } from "./index";

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $t: (key: string, params?: Record<string, string | number>) => string;
        $i18n: typeof i18nState;
        $setLocale: (lang: Locale) => void;
    }
}
