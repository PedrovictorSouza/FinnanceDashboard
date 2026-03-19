import de from "../../messages/de.json";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";

export const languages = ["EN", "PT", "DE"] as const;

export type LanguageCode = (typeof languages)[number];

export const languageLocales: Record<LanguageCode, string> = {
  EN: "en-US",
  PT: "pt-BR",
  DE: "de-DE",
};

const dictionaries = {
  EN: en,
  PT: pt,
  DE: de,
} as const;

export type DashboardDictionary = (typeof dictionaries)[LanguageCode];

export function isLanguageCode(value: string | undefined): value is LanguageCode {
  return typeof value === "string" && languages.includes(value as LanguageCode);
}

export function getDictionary(language: LanguageCode): DashboardDictionary {
  return dictionaries[language];
}
