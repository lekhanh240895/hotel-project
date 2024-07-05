'use server';

import { generateText, streamText } from 'ai';
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState
} from 'ai/rsc';
import { google } from '@ai-sdk/google';
import { nanoid } from '../utils';
import { getMe } from '../actions';
import { Chat, Message } from '../types/chat';
import { saveChat } from '../services/chat';
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage
} from '@/app/components/message';
import { ListHotels } from '@/app/components/hotels/list-hotels';
import { z } from 'zod';
import { format } from 'date-fns';

export async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n${content}`
      }
    ]
  });

  const history = aiState.get().messages.map((message: Message) => ({
    role: message.role,
    content: message.content
  }));

  const textStream = createStreamableValue('');
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  (async () => {
    try {
      const result = await streamText({
        model: google('models/gemini-1.5-flash'),
        temperature: 0,
        tools: {
          listDestinations: {
            description: 'List destinations to travel cities, max 5.',
            parameters: z.object({
              destinations: z.array(
                z
                  .string()
                  .describe(
                    'List of destination cities. Include Đà N as one of the cities.'
                  )
              )
            })
          },
          showHotels: {
            description: 'Show the UI to choose a hotel for the trip.',
            parameters: z.object({ city: z.string() })
          },
          checkoutBooking: {
            description:
              'Show the UI to purchase/checkout a flight and hotel booking.',
            parameters: z.object({ shouldConfirm: z.boolean() })
          }
        },
        system: `\
    You are a friendly assistant that helps the user with booking flights to destinations that are based on a list of books. You can you give travel recommendations based on the books, and will continue to help the user book a flight to their destination.

    The date today is ${format(new Date(), 'd LLLL, yyyy')}.
    The user's current location is San Francisco, CA, so the departure city will be San Francisco and airport will be San Francisco International Airport (SFO). The user would like to book the flight out on May 12, 2024.

    List United Airlines flights only.

    Here's the flow:
      1. List holiday destinations based on a collection of books.
      2. List flights to destination.
      3. Choose a flight.
      4. Choose a seat.
      5. Choose hotel
      6. Purchase booking.
      7. Show boarding pass.
    `,
        messages: [...history]
      });

      let textContent = '';
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        const { type } = delta;

        if (type === 'text-delta') {
          const { textDelta } = delta;

          textContent += textDelta;
          messageStream.update(<BotMessage content={textContent} />);

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: textContent
              }
            ]
          });
        } else if (type === 'tool-call') {
          const { toolName, args } = delta;

          if (toolName === 'showHotels') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content:
                    "Here's a list of hotels for you to choose from. Select one to proceed to payment.",
                  display: {
                    name: 'showHotels',
                    props: {}
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <ListHotels />
              </BotCard>
            );
          }
        }
      }

      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        'The AI got rate limited, please try again later.'
      );
      uiStream.error(error);
      spinnerStream.error(error);
      messageStream.error(error);
      aiState.done(null);
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  };
}

export type AIState = {
  chatId: string;
  interactions?: string[];
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] }
  // onSetAIState: async ({ state, done }) => {
  //   'use server';
  //   console.log({ state, done });
  //   const res = await getMe();

  //   if (res.data) {
  //     // const { chatId, messages } = state;
  //     // const userId = res.data._id as string;
  //     // const path = `/chat/${chatId}`;
  //     // const title = messages[0].content.substring(0, 100);
  //     // const chat: Chat = {
  //     //   id: chatId,
  //     //   title,
  //     //   userId,
  //     //   messages,
  //     //   path
  //     // };
  //     // await saveChat(chat);
  //   } else {
  //     return;
  //   }
  // },
  // onGetUIState: async () => {
  //   'use server';

  //   const res = await getMe();

  //   if (res.data) {
  //     const aiState = getAIState() as Chat;

  //     if (aiState) {
  //       const uiState = getUIStateFromAIState(aiState);
  //       return uiState;
  //     }
  //   } else {
  //     return;
  //   }
  // }
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'assistant' ? (
          message.display?.name === 'showFlights' ? (
            <BotCard>
              <ListHotels hotels={[]} />
            </BotCard>
          ) : (
            <BotMessage content={message.content} />
          )
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }));
};
