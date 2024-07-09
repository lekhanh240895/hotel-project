'use client';

import React, { Fragment, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition
} from '@headlessui/react';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { i18nConfig } from '@/i18nConfig';
import { useCurrentLocale } from 'next-i18n-router/client';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export interface IMenuItem {
  title: string;
  locale?: string;
  to?: string;

  children?: {
    title?: string;
    data: IMenuItem[];
  };
}

type Props = {
  children: React.ReactNode;
  items: IMenuItem[];
};

const CustomMenu = ({ items, children }: Props) => {
  const router = useRouter();
  const currentLocale = useCurrentLocale(i18nConfig);
  const currentPathname = usePathname();
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [history, setHistory] = useState<
    {
      data: IMenuItem[];
      title?: string;
    }[]
  >([
    {
      data: items
    }
  ]);
  const current = history[history.length - 1];

  const handleOpenMenu = (item: IMenuItem) => {
    if (item.children) {
      // Use item.children.data if it exists, or an empty array as a fallback
      const childrenData = item.children.data || [];

      setHistory((prevState) => [
        ...prevState,
        {
          data: childrenData,
          title: item.children?.title // You may want to set the title as well
        }
      ]);
    }
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, history.length - 1));
  };

  const handleChangeLocale = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;
    const params = new URLSearchParams(searchParams);

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push('/' + newLocale + currentPathname + `?${params.toString()}`);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`) +
          `?${params.toString()}`
      );
    }

    router.refresh();
  };

  const handleItemClick = async (event: React.MouseEvent, item: IMenuItem) => {
    if (item.children) {
      event.preventDefault();
      handleOpenMenu(item);
    } else if (item.locale) {
      handleChangeLocale(item.locale);
    } else if (item.title === t('header.logout_title')) {
    }
  };

  const renderMenuItems = () => {
    return current.data.map((item, index) => (
      <MenuItem key={index}>
        {({ focus }) => (
          <div className="px-1 py-1">
            <div
              className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } group flex w-full cursor-pointer items-center rounded-md text-sm`}
              onClick={(event) => handleItemClick(event, item)}
            >
              <MenuButton
                as={Button}
                className={`flex h-[unset] w-full items-center justify-start px-2 py-2`}
              >
                {item.title}
              </MenuButton>
            </div>
          </div>
        )}
      </MenuItem>
    ));
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center">
        <MenuButton as={Fragment}>{children}</MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        {history.length > 1 && (
          <div className="flex items-center justify-start gap-5 p-2">
            <ChevronLeftIcon
              className={`text-textColor h-7 w-7 cursor-pointer transition`}
              onClick={handleBack}
            />

            <h1>{current.title}</h1>
          </div>
        )}
        {renderMenuItems()}
      </MenuItems>
    </Menu>
  );
};

export default CustomMenu;
