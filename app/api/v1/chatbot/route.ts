import { G4F, chunkProcessor } from 'g4f';
const fs = require('fs');

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const g4f = new G4F();

  const messages = [
    { role: 'system', content: "You're an expert bot in poetry." },
    {
      role: 'user',
      content: "Let's see, write a single paragraph-long poem for me."
    }
  ];
  const options = {
    model: 'gpt-4',
    debug: true,
    retry: {
      times: 3,
      condition: (text: any) => {
        const words = text.split(' ');
        return words.length > 10;
      }
    },
    output: (text: any) => {
      return text + ' 💕🌹';
    }
  };
  const text = await g4f.chatCompletion(messages, options);
  console.log(text);

  return Response.json({ text });
}
