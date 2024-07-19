import BackButton from '@/app/components/BackButton';
import ChatSidebar from '@/app/components/ChatSidebar';
import Header from '@/app/components/Header';
import { getMe } from '@/app/lib/actions';
import { getChats } from '@/app/lib/services/chat';
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
  const res = await getMe();
  const chats = await getChats(res.data?._id);
  return (
    <main>
      <div className="relative mx-auto w-full bg-gray-200 transition-all">
        <BackButton className="fixed left-0 top-0 z-10 hidden h-16 w-[68px] cursor-pointer border-b bg-white p-6 md:flex" />
        <Header chats={chats} />

        <div className="flex h-screen max-h-screen w-full bg-background pt-16">
          <ChatSidebar chats={chats} />

          {children}
        </div>
      </div>
    </main>
  );
}
