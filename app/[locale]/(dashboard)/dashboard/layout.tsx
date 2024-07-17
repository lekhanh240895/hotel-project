import { DashboardProvider } from '@/app/context/DashboardPageContext';
import { AI } from '@/app/lib/chat/actions';

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const history = [];

  return (
    <AI initialUIState={[]}>
      <DashboardProvider>{children}</DashboardProvider>
    </AI>
  );
}
