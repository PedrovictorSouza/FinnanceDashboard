import { DashboardPage } from "./components/dashboard/DashboardPage";
import { getDictionary, isLanguageCode, type LanguageCode } from "./lib/i18n";

type HomePageProps = {
  searchParams?: {
    lang?: string | string[];
  };
};

function getLanguage(searchParams: HomePageProps["searchParams"]): LanguageCode {
  const langParam = Array.isArray(searchParams?.lang) ? searchParams.lang[0] : searchParams?.lang;
  const normalizedLang = langParam?.toUpperCase();

  return isLanguageCode(normalizedLang) ? normalizedLang : "PT";
}

export default function HomePage({ searchParams }: HomePageProps) {
  const language = getLanguage(searchParams);
  const copy = getDictionary(language);

  return <DashboardPage language={language} copy={copy} />;
}
