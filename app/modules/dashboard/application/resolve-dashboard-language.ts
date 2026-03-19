import { isLanguageCode, type LanguageCode } from "../../../lib/i18n";

export type DashboardRouteSearchParams = {
  lang?: string | string[];
};

export function resolveDashboardLanguage(
  searchParams: DashboardRouteSearchParams | undefined,
): LanguageCode {
  const langParam = Array.isArray(searchParams?.lang) ? searchParams.lang[0] : searchParams?.lang;
  const normalizedLang = langParam?.toUpperCase();

  return isLanguageCode(normalizedLang) ? normalizedLang : "PT";
}
