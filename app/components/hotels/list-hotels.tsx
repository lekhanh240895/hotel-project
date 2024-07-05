/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useActions, useUIState } from 'ai/rsc';

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ListHotelsProps {
  hotels?: Hotel[];
}

export const ListHotels = ({
  hotels = [
    {
      id: 1,
      name: 'The St. Regis Rome',
      description: 'Renowned luxury hotel with a lavish spa',
      price: 450
    },
    {
      id: 2,
      name: 'The Inn at the Roman Forum',
      description: 'Upscale hotel with Roman ruins and a bar',
      price: 145
    },
    {
      id: 3,
      name: 'Hotel Roma',
      description: 'Vibrant property with free breakfast',
      price: 112
    }
  ]
}: ListHotelsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div className="grid gap-4">
      <p>
        We recommend a 3 night stay in Rome. Here are some hotels you can choose
        from.
      </p>
      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-2 sm:p-4">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex cursor-pointer justify-between gap-4 rounded-xl p-2 hover:bg-zinc-50"
            onClick={async () => {
              const response = await submitUserMessage(
                `I want to book the ${hotel.name}, proceed to checkout by calling checkoutBooking function.`
              );
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ]);
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="aspect-video w-20 overflow-hidden rounded-lg bg-zinc-100">
                <img
                  className="aspect-video h-full rounded-lg object-cover"
                  src={`/images/${hotel.id}.jpg`}
                />
              </div>
              <div>
                <div className="font-medium">{hotel.name}</div>
                <div className="text-sm text-zinc-600">{hotel.description}</div>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-right text-lg font-medium">
                ${hotel.price}
              </div>
              <div className="text-right text-xs text-zinc-600">per night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
