import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import { i18nConfig } from '@/i18nConfig';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Hotel Dashboard',
    default: 'Hotel Dashboard'
  }
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => {
    locale;
  });
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <main>
      <Sidebar />
      <div className="wrap relative mx-auto h-16 w-full border-b pl-[68px]">
        <Header />
        <div className="pt-16">{children}</div>
      </div>
    </main>
  );
}
