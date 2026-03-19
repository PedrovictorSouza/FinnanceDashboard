import { DashboardPageRoute } from "./modules/dashboard/presentation/DashboardPageRoute";

type HomePageProps = {
  searchParams?: {
    lang?: string | string[];
  };
};

export default function HomePage({ searchParams }: HomePageProps) {
  return <DashboardPageRoute searchParams={searchParams} />;
}
