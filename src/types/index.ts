import { AI } from 'src/constants';
export type AIKey = keyof typeof AI;
export type AIType = (typeof AI)[AIKey];
