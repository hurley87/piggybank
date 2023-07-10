import twilio from 'twilio';

export async function POST(req: Request): Promise<Response> {
  try {
    const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
    const token = <string>process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, token);
    const { phoneNumber, code } = (await req.json()) as {
      phoneNumber: string;
      code: string;
    };
    console.log(phoneNumber, code);
    const resp = await client.messages.create({
      body: 'Verification code: ' + code,
      from: '+16476922850',
      to: phoneNumber,
    });
    console.log(resp);
    return new Response('Sucess');
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
