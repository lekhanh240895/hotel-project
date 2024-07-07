import RegisterForm from '@/app/components/RegisterForm';
import TranslationsProvider from '@/app/components/TranslationsProvider';
import initTranslations from '@/app/i18n';
import { Metadata } from 'next';

type Props = {
  params: {
    locale: string;
  };
};

const i18nNamespaces = ['common', 'register'];

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: t('register:document_title')
  };
}

export default async function Register({ params: { locale } }: Props) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <div className="grid flex-1 place-items-center">
        <div className="mx-auto w-full max-w-[450px] rounded bg-white p-4 md:max-w-2xl md:p-10 dark:bg-black dark:text-white dark:ring-2 dark:ring-white">
          <h1 className="mb-4 px-4 text-center text-3xl font-bold md:mb-10">
            {t('register:title')}
          </h1>

          <RegisterForm />
        </div>
      </div>
    </TranslationsProvider>
  );
}
