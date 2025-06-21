export const SUPPORTED_LANGUAGES = Object.freeze({
  ENG: 'en',
  UA: 'uk',
  PL: 'pl',
});

export const SUPPORTED_LANGUAGES_KEYS = Object.values(SUPPORTED_LANGUAGES);

export type SupportedLanguagesKeys = keyof typeof SUPPORTED_LANGUAGES;

export type SupportedLanguages =
  (typeof SUPPORTED_LANGUAGES)[SupportedLanguagesKeys];
