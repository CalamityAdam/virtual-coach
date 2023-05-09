import express, { Request, Response } from 'express';
import { urlencoded } from 'body-parser';
import twilio from 'twilio';
import openai from 'openai';
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 1337;

const apiKey = process.env.OPENAI_API_KEY;

/* @ts-ignore */
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendTwilioResponse(
  response: string,
  req: Request,
  res: Response
) {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

app.use(urlencoded({ extended: false }));

app.post('/sms', async (req: Request, res: Response) => {
  const userMessage = req.body.Body.toLowerCase().trim();
  // const userPhoneNumber = req.body.From;

  if (userMessage === 'advice') {
    const initialResponse = 'Hello, this is Gunther. How can I help you today?';
    await sendTwilioResponse(initialResponse, req, res);
  } else {
    // handle future conversation with Gunther
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
