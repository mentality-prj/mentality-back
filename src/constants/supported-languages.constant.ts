export const SUPPORTED_LANGUAGES = ['en', 'uk', 'pl'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
