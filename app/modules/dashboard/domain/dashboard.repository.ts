import type { LanguageCode } from "../../../lib/i18n";
import type { DashboardPageViewModel } from "./dashboard.types";

export interface DashboardRepository {
  getPageViewModel(language: LanguageCode): Promise<DashboardPageViewModel>;
}
