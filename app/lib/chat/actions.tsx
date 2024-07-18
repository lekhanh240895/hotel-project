import 'server-only';

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue
} from 'ai/rsc';
import { format } from 'date-fns';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage
} from '@/app/components/message';

import { nanoid, sleep } from '@/app/lib/utils';

import { CheckIcon, SpinnerIcon } from '@/app/components/ui/icons';
import { ListHotels } from '@/app/components/hotels/list-hotels';
import { Video } from '@/app/components/media/video';
import { rateLimit } from './ratelimit';
import { auth } from '@/auth';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
);

async function describeImage(imageBase64: string) {
  'use server';

  const aiState = getMutableAIState();
  const spinnerStream = createStreamableUI(null);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  uiStream.update(
    <BotCard>
      <Video isLoading />
    </BotCard>
  );
  (async () => {
    try {
      let text = '';

      // attachment as video for demo purposes,
      // add your implementation here to support
      // video as input for prompts.
      if (imageBase64 === '') {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        text = `
      The books in this image are:

      1. The Little Prince by Antoine de Saint-Exupéry
      2. The Prophet by Kahlil Gibran
      3. Man's Search for Meaning by Viktor Frankl
      4. The Alchemist by Paulo Coelho
      5. The Kite Runner by Khaled Hosseini
      6. To Kill a Mockingbird by Harper Lee
      7. The Catcher in the Rye by J.D. Salinger
      8. The Great Gatsby by F. Scott Fitzgerald
      9. 1984 by George Orwell
      10. Animal Farm by George Orwell
      `;
      } else {
        const imageData = imageBase64.split(',')[1];

        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const prompt = 'List the books in this image.';
        const image = {
          inlineData: {
            data: imageData,
            mimeType: 'image/png'
          }
        };

        const result = await model.generateContent([prompt, image]);
        text = result.response.text();
        console.log(text);
      }

      spinnerStream.done(null);
      messageStream.done(null);

      uiStream.done(
        <BotCard>
          <Video />
        </BotCard>
      );

      aiState.done({
        ...aiState.get(),
        interactions: [text]
      });
    } catch (e) {
      console.error(e);

      const error = new Error(
        'The AI got rate limited, please try again later.'
      );
      uiStream.error(error);
      spinnerStream.error(error);
      messageStream.error(error);
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  };
}

async function submitUserMessage(content: string) {
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

  const history = aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content
  }));
  // console.log(history)

  const textStream = createStreamableValue('');
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  (async () => {
    try {
      const result = await streamText({
        model: google('models/gemini-1.5-flash'),
        temperature: 0,
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

          if (toolName === 'listDestinations') {
            const { destinations } = args;

            uiStream.update(
              <BotCard>
                <Destinations destinations={destinations} />
              </BotCard>
            );

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `Here's a list of holiday destinations based on the books you've read. Choose one to proceed to booking a flight. \n\n ${args.destinations.join(', ')}.`,
                  display: {
                    name: 'listDestinations',
                    props: {
                      destinations
                    }
                  }
                }
              ]
            });
          } else if (toolName === 'showFlights') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content:
                    "Here's a list of flights for you. Choose one and we can proceed to pick a seat.",
                  display: {
                    name: 'showFlights',
                    props: {
                      summary: args
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <ListFlights summary={args} />
              </BotCard>
            );
          } else if (toolName === 'showSeatPicker') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content:
                    "Here's a list of available seats for you to choose from. Select one to proceed to payment.",
                  display: {
                    name: 'showSeatPicker',
                    props: {
                      summary: args
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <SelectSeats summary={args} />
              </BotCard>
            );
          } else if (toolName === 'showHotels') {
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
          } else if (toolName === 'checkoutBooking') {
            aiState.done({
              ...aiState.get(),
              interactions: []
            });

            uiStream.update(
              <BotCard>
                <PurchaseTickets />
              </BotCard>
            );
          } else if (toolName === 'showBoardingPass') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content:
                    "Here's your boarding pass. Please have it ready for your flight.",
                  display: {
                    name: 'showBoardingPass',
                    props: {
                      summary: args
                    }
                  }
                }
              ]
            });

            uiStream.update(
              <BotCard>
                <BoardingPass summary={args} />
              </BotCard>
            );
          } else if (toolName === 'showFlightStatus') {
            aiState.update({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `The flight status of ${args.flightCode} is as follows:
                Departing: ${args.departingCity} at ${args.departingTime} from ${args.departingAirport} (${args.departingAirportCode})
                `
                }
              ],
              display: {
                name: 'showFlights',
                props: {
                  summary: args
                }
              }
            });

            uiStream.update(
              <BotCard>
                <FlightStatus summary={args} />
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
      textStream.error(error);
      messageStream.error(error);
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  };
}

export async function requestCode() {
  'use server';

  const aiState = getMutableAIState();

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: 'assistant',
        content:
          "A code has been sent to user's phone. They should enter it in the user interface to continue."
      }
    ]
  });

  const ui = createStreamableUI(
    <div className="animate-spin">
      <SpinnerIcon />
    </div>
  );

  (async () => {
    await sleep(2000);
    ui.done();
  })();

  return {
    status: 'requires_code',
    display: ui.value
  };
}

export async function validateCode() {
  'use server';

  const aiState = getMutableAIState();

  const status = createStreamableValue('in_progress');
  const ui = createStreamableUI(
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-zinc-500">
      <div className="animate-spin">
        <SpinnerIcon />
      </div>
      <div className="text-sm text-zinc-500">
        Please wait while we fulfill your order.
      </div>
    </div>
  );

  (async () => {
    await sleep(2000);

    ui.done(
      <div className="flex flex-col items-center justify-center gap-3 p-4 text-center text-emerald-700">
        <CheckIcon />
        <div>Payment Succeeded</div>
        <div className="text-sm text-zinc-600">
          Thanks for your purchase! You will receive an email confirmation
          shortly.
        </div>
      </div>
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          role: 'assistant',
          content: 'The purchase has completed successfully.'
        }
      ]
    });

    status.done('completed');
  })();

  return {
    status: status.value,
    display: ui.value
  };
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    requestCode,
    validateCode,
    describeImage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] }
});
