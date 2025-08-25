export const DEFAULT_PORT = 3200;
export const PAGE = 1;
export const LIMIT = 20;
export const REPORT_LIMIT = 10;
export const DEFAULT_DELAY = 1000;
export const LONG_DELAY_MULTIPLIER = 5;
export const LONG_DELAY = LONG_DELAY_MULTIPLIER * DEFAULT_DELAY;
export const MOOD_MAX_LEVEL = 5;
export const MOOD_MIN_LEVEL = 1;

export const AI = Object.freeze({
  OpenAI: 'openai',
  HuggingFace: 'huggingface',
});
