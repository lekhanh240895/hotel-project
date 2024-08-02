import 'server-only';

import { streamText } from 'ai';
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState
} from 'ai/rsc';
import { google } from '@ai-sdk/google';
import { nanoid } from '../utils';
import { Chat, Message } from '../types/chat';
import { saveChat } from '../services/chat';
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage
} from '@/app/components/message';
import { z } from 'zod';
import { format } from 'date-fns';
import { LIST_ROUTER } from '../constants/common';
import { auth } from '@/auth';
import ChatMap from '@/app/components/ChatMap';
import ChatHotel from '@/app/components/ChatHotels';
import ChatHotelDetail from '@/app/components/ChatHotelDetail';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';

// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY
// });

export async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState();
  const interactions = aiState.get().interactions;
  const formattedContent =
    interactions.length > 0
      ? `${interactions.join('\n\n')}\n\n${content}`
      : content;
  let isStreamText: boolean = false;

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: formattedContent
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
        model: google('models/gemini-1.5-pro-latest'),
        // model: groq('llama-3.1-70b-versatile'),
        temperature: 0,
        tools: {
          showHotels: {
            description: 'Show the UI to choose a hotel for the trip.',
            parameters: z.object({
              route: z.array(
                z.string().describe('A route is a list of destination cities.')
              )
            })
          },
          showMaps: {
            description: 'Show map from travel route.',
            parameters: z.object({
              route: z.array(
                z.string().describe('A route is a list of destination cities.')
              )
            })
          },
          showHotelDetail: {
            description: 'Show the UI of detail information of a hotel.',
            parameters: z.object({
              _id: z.string().describe('An unique _id of a hotel')
            })
          }
        },
        system: `
You are a friendly assistant who helps users plan their travel itinerary to destinations in Vietnam for their vacation.
You can make travel recommendations based on your information in Vietnam or from user input and will continue to help users get the necessary information

Today's date is ${format(new Date(), 'd LLLL, yyyy')}.
The user's current location is in Vietnam. Users want to search for a list of famous hotels, restaurants and famous attractions on that travel route to enjoy their vacation.
Your answer language is based on the user's language.

Here is the flow:
 1. Display travel programs according to the travel itinerary (list of destinations) that the user requests. 
 Example: 
Ngày 1: Hà Nội
Sáng: Đón khách tại sân bay Nội Bài và di chuyển về khách sạn 4 sao tại trung tâm Hà Nội.
Trưa: Ăn trưa tại nhà hàng địa phương.
Chiều: Tham quan Hồ Hoàn Kiếm, Đền Ngọc Sơn, và phố cổ Hà Nội.
Tối: Ăn tối tại nhà hàng và dạo phố đi bộ quanh Hồ Hoàn Kiếm. Nghỉ đêm tại khách sạn.
 2. Make suggestions about displaying a list of hotels, restaurants or famous attractions on that travel route to the user.
 3. Show hotel list with UI show hotels, list restaurants, list famous attractions on that tourist route
 4. Create a tour program table according to the above schedule if the user requests
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
          isStreamText = true;
        } else if (type === 'tool-call') {
          const { toolName, args } = delta;

          if (toolName === 'showHotels') {
            const { route } = args;
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `Here's a list of hotels for you to choose from: ${route.join(', ')}`,
                  display: {
                    name: 'showHotels',
                    props: {
                      route
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <ChatHotel route={route} />
              </BotCard>
            );
          } else if (toolName === 'showHotelDetail') {
            const { _id } = args;
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `Here are details information about the hotel: ${_id}`,
                  display: {
                    name: 'showHotelDetail',
                    props: {
                      _id
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <ChatHotelDetail _id={_id} />
              </BotCard>
            );
          } else if (toolName === 'showMaps') {
            const { route } = args;

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `Here's a map of your travel route: ${route.join(', ')}.`,
                  display: {
                    name: 'showMaps',
                    props: {
                      route
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <ChatMap route={route} />
              </BotCard>
            );
          }
        }
      }

      if (isStreamText) {
        aiState.done({
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
      }
      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error('The AI got error, please try again later.');
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
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
  onSetAIState: async ({ state, done }) => {
    'use server';
    const session = await auth();

    if (session && session.user) {
      const { chatId, messages } = state;

      const filterMessages = messages.reduce(
        (acc, message) => {
          if (message.role === 'user') {
            if (acc.lastAssistantMessage) {
              acc.result.push(acc.lastAssistantMessage);
            }
            acc.result.push(message);
          } else if (message.role === 'assistant') {
            acc.lastAssistantMessage = message;
          }

          // Check if it's the last message in the array
          if (
            message === messages[messages.length - 1] &&
            acc.lastAssistantMessage
          ) {
            acc.result.push(acc.lastAssistantMessage);
          }

          return acc;
        },
        {
          result: [] as Message[],
          lastAssistantMessage: null as Message | null
        }
      ).result;

      const userId = session.user.id as string;
      const path = `${LIST_ROUTER.CHAT}/${chatId}`;
      const title = messages[0].content.substring(0, 100);
      const chat: Chat = {
        id: chatId,
        title,
        userId,
        messages: filterMessages,
        path
      };
      await saveChat(chat);
    } else {
      return;
    }
  },
  onGetUIState: async () => {
    'use server';

    const session = await auth();

    if (session && session.user) {
      const aiState = getAIState() as Chat;
      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  }
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'assistant' ? (
          message.display?.name === 'showHotels' ? (
            <BotCard>
              <ChatHotel route={message.display.props.route} />
            </BotCard>
          ) : message.display?.name === 'showHotelDetail' ? (
            <BotCard>
              <ChatHotelDetail _id={message.display.props._id} />
            </BotCard>
          ) : message.display?.name === 'showMaps' ? (
            <BotCard>
              <ChatMap route={message.display.props.route} />
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
