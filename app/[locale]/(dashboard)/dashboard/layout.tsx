import { DashboardProvider } from '@/app/context/DashboardContext';

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const history = [];

  return <DashboardProvider>{children}</DashboardProvider>;
}
