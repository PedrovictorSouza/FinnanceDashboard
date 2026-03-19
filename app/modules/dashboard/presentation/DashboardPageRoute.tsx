import { DashboardPage } from "../../../components/dashboard/DashboardPage";
import {
  resolveDashboardLanguage,
  type DashboardRouteSearchParams,
} from "../application/resolve-dashboard-language";
import { getDashboardPageViewModel } from "../application/get-dashboard-page-view-model";

type DashboardPageRouteProps = {
  searchParams?: DashboardRouteSearchParams;
};

export async function DashboardPageRoute({ searchParams }: DashboardPageRouteProps) {
  const language = resolveDashboardLanguage(searchParams);
  const viewModel = await getDashboardPageViewModel(language);

  return <DashboardPage viewModel={viewModel} />;
}
