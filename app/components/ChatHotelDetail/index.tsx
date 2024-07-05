'use client';

import { useQuery } from '@tanstack/react-query';
import ChatSuggestion from '../ChatSuggestion';
import { requestGetHotelDetail } from '@/app/lib/services/hotels';
import HotelDetail from '../HotelDetail';
import { BotMessage } from '../message';

type Props = {
  _id: string;
};

const ChatHotelDetail = ({ _id }: Props) => {
  const { data } = useQuery({
    queryKey: ['hotels', _id],
    queryFn: () => requestGetHotelDetail(_id)
  });

  if (!data) return;

  const hotel = data?.data;

  return (
    <div className="grid gap-4">
      <BotMessage
        showAvatar={false}
        showAction={false}
        content={`Here are the details for the hotel: ${hotel.vietnamese_name}`}
      />

      <HotelDetail hotel={hotel} />

      <ChatSuggestion />
    </div>
  );
};

export default ChatHotelDetail;
