import BackButton from '@/app/components/BackButton';
import Header from '@/app/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Hotel AI Dashboard',
    default: 'Hotel AI Dashboard'
  }
};

export default async function Layout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <main>
      <div className="relative mx-auto w-full bg-gray-200 transition-all">
        <BackButton className="fixed left-0 top-0 hidden w-[68px] cursor-pointer border-b bg-white p-6 md:flex" />
        <Header />
        {children}
      </div>
    </main>
  );
}
