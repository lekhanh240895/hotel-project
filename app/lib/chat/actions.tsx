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
import { LIST_ROUTER } from '../constants/common';

export async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState();
  const interactions = aiState.get().interactions;
  const formattedContent =
    interactions.length > 0
      ? `${interactions.join('\n\n')}\n\n${content}`
      : content;

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
          }
        },
        system: `\
    You are a friendly assistant that helps the user choose destinations that are in Vietnam country for their holiday. 
    You can you give travel recommendations based on famous places in Vietnam or from user's input, and will continue to help the user select a route for travelling.

    The date today is ${format(new Date(), 'd LLLL, yyyy')}.
    The user's current location is in Vietnam. The user would like to find list of famous hotels, restaurants, and famous sight seeings in that travel route to enjoy their holiday.

    Here's the flow:
      1. List holiday destinations based on user requirements or your information from famous places.
      2. List hotels, list restaurants, list famous sight seeings if user requests
      3. Calculate the quote for each customer if user requests
      4. Create a tour program table according to the above schedule if user requests
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
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
  onSetAIState: async ({ state, done }) => {
    'use server';
    const res = await getMe();

    if (res.data) {
      const { chatId, messages } = state;
      const userId = res.data._id as string;
      const path = `${LIST_ROUTER.CHAT}/${chatId}`;
      const title = messages[0].content.substring(0, 100);
      const chat: Chat = {
        id: chatId,
        title,
        userId,
        messages,
        path
      };
      await saveChat(chat);
    } else {
      return;
    }
  },
  onGetUIState: async () => {
    'use server';

    const res = await getMe();

    if (res.data) {
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
              <ListHotels />
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
