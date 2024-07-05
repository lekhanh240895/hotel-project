import { Inter } from 'next/font/google';
import './globals.css';
import { dir } from 'i18next';
import { Metadata } from 'next';
import { i18nConfig } from '../../i18nConfig';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Hotel AI',
    default: 'Hotel AI'
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
    <html lang={locale} dir={dir(locale)}>
      <body className={inter.className}>
        {children}
        <ToastContainer
          hideProgressBar={true}
          icon={false}
          toastClassName={'bg-red-500'}
          theme="dark"
          autoClose={2000}
        />
      </body>
    </html>
  );
}
