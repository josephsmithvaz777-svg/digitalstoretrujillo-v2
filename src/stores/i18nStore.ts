import { atom } from 'nanostores';
import { detectUserLanguage, type Language, TRANSLATIONS } from '../lib/i18n';

// Language store
export const currentLanguage = atom<Language>('en');

// Initialize language from detection
export async function initializeLanguage() {
    const lang = await detectUserLanguage();
    currentLanguage.set(lang);

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }
}

// Update language
export function updateLanguage(lang: Language) {
    currentLanguage.set(lang);
    localStorage.setItem('user-language', lang);

    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }

    // Trigger custom event
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
    }
}

// Helper to get translation
export function useTranslation() {
    const lang = currentLanguage.get();
    return (key: keyof typeof TRANSLATIONS.en) => {
        return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
    };
}
