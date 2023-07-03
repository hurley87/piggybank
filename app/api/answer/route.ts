import { OpenAIStream } from '@/utils';

export const config = {
  runtime: 'runtime',
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt } = (await req.json()) as {
      prompt: string;
    };

    console.log('prompt', prompt);

    const apiKey = process.env.OPENAI_API_KEY as string;
    const stream = await OpenAIStream(prompt, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
