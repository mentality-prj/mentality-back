export class MockHuggingFaceService {
  translateText(_text: string, targetLanguage: 'pl' | 'en'): string {
    // Mock translation logic
    const translations: Record<string, Record<string, string>> = {
      pl: { example: 'Przykładowy tekst przetłumaczony na polski.' },
      en: { example: 'Sample text translated to English.' },
    };

    const languageTranslations = translations['uk'];
    if (
      languageTranslations &&
      Object.prototype.hasOwnProperty.call(languageTranslations, targetLanguage)
    ) {
      if (['pl', 'en'].includes(targetLanguage)) {
        return languageTranslations[`${targetLanguage}`];
      }
      return 'Translation not available.';
    }
    return 'Translation not available.';
  }
}
