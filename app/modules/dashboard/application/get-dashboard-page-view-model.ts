import type { LanguageCode } from "../../../lib/i18n";
import type { DashboardRepository } from "../domain/dashboard.repository";
import type { DashboardPageViewModel } from "../domain/dashboard.types";
import { staticDashboardRepository } from "../infrastructure/static-dashboard.repository";

export async function getDashboardPageViewModel(
  language: LanguageCode,
  repository: DashboardRepository = staticDashboardRepository,
): Promise<DashboardPageViewModel> {
  return repository.getPageViewModel(language);
}
