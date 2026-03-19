import {
  getDictionary,
  languageLocales,
  languages,
  type DashboardDictionary,
  type LanguageCode,
} from "../../../lib/i18n";
import type { DashboardRepository } from "../domain/dashboard.repository";
import type { DashboardPageViewModel } from "../domain/dashboard.types";

function getLanguageHref(language: LanguageCode) {
  return language === "PT" ? "/" : `/?lang=${language}`;
}

function mapDictionaryToPageViewModel(
  language: LanguageCode,
  dictionary: DashboardDictionary,
): DashboardPageViewModel {
  return {
    language,
    locale: languageLocales[language],
    skipLink: dictionary.skipLink,
    languageAriaLabel: dictionary.aria.language,
    languageOptions: languages.map((code) => ({
      code,
      href: getLanguageHref(code),
      label: dictionary.languageButtons[code],
      isCurrent: code === language,
    })),
    sidebarAria: {
      sidebar: dictionary.aria.sidebar,
      mainNav: dictionary.aria.mainNav,
    },
    components: dictionary.components,
    sidebar: dictionary.sidebar,
    search: dictionary.search,
    topBar: dictionary.topBar,
    chart: dictionary.chart,
    walletPanel: dictionary.walletPanel,
    verticalCard: dictionary.verticalCard,
    spendingCard: dictionary.spendingCard,
    variableCard: dictionary.variableCard,
    healthCard: dictionary.healthCard,
    costCard: dictionary.costCard,
    goalCard: dictionary.goalCard,
    transactionCard: dictionary.transactionCard,
  };
}

export const staticDashboardRepository: DashboardRepository = {
  async getPageViewModel(language) {
    const dictionary = getDictionary(language);

    return mapDictionaryToPageViewModel(language, dictionary);
  },
};
