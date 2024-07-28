'use client';

import { useActions, useUIState } from 'ai/rsc';
import HotelTable from '../HotelTable';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { requestSearchHotels } from '@/app/lib/services/hotels';
import { useScrollAnchor } from '@/app/lib/hooks/use-scroll-anchor';

interface ListHotelsProps {
  city: string;
}

const ChatHotelList = ({ city }: ListHotelsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const offset = Number(limit) * (Number(page) - 1);
  const { scrollToBottom } = useScrollAnchor();

  const { data } = useQuery({
    queryKey: ['hotels', page, city],
    queryFn: () =>
      requestSearchHotels({
        offset,
        limit,
        address: city,
        province: city
      })
  });

  if (!data) return;

  const {
    items: hotels,
    pagination: { total }
  } = data.data;

  const totalPages = Math.ceil(total / Number(limit));

  const handleViewDetail = async (hotelId: string) => {
    const response = await submitUserMessage(
      `I would like to see detail information of the hotel with _id=${hotelId}. Proceed to hotel detail.`
    );
    setMessages((currentMessages: any[]) => [...currentMessages, response]);
    scrollToBottom();
  };

  return (
    <HotelTable
      hotels={hotels}
      total={total}
      totalPages={totalPages}
      onViewDetail={handleViewDetail}
    />
  );
};

export default ChatHotelList;
