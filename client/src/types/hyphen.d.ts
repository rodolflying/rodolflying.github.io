// The "hyphen" package ships no types; we only use its synchronous hyphenators.
declare module 'hyphen/es' {
  export function hyphenateSync(text: string, options?: { hyphenChar?: string; minWordLength?: number }): string;
}
declare module 'hyphen/en' {
  export function hyphenateSync(text: string, options?: { hyphenChar?: string; minWordLength?: number }): string;
}
