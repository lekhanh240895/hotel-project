import { DashboardProvider } from '@/app/context/DashboardPageContext';

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
