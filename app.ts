import express, { Request, Response } from 'express';
import { urlencoded } from 'body-parser';
import twilio from 'twilio';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 1337;

/* @ts-ignore */
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const openaiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai: OpenAIApi = new OpenAIApi(openaiConfiguration);
const systemMessage = {
  role: ChatCompletionRequestMessageRoleEnum.System,
  content:
    'Respond poetically, formatting your response to include 26 words, each word starting with a different letter of the alphabet and in alphabetical order.',
};

// in-memory conversation db
// in prod this should be in a database
const conversation: Map<string, ChatCompletionRequestMessage[]> = new Map();

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

function updateConversationStore(
  phoneNumber: string,
  role: ChatCompletionRequestMessageRoleEnum,
  content: string
): void {
  if (!conversation.has(phoneNumber)) {
    conversation.set(phoneNumber, [systemMessage]);
  }
  conversation.get(phoneNumber)!!.push({ role, content });
}

function getConversationHistory(
  phoneNumber: string
): ChatCompletionRequestMessage[] {
  return conversation.get(phoneNumber) || [systemMessage];
}

async function generateResponseWithGPT4(
  userMessage: string,
  conversationHistory: ChatCompletionRequestMessage[]
): Promise<string> {
  const messages = [
    ...conversationHistory,
    { role: ChatCompletionRequestMessageRoleEnum.User, content: userMessage },
  ];

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages,
    max_tokens: 150,
    n: 1,
    temperature: 1,
  });

  const guntherResponse = response.data.choices[0].message?.content;
  return guntherResponse || 'Sorry, I did not understand that.';
}

app.use(urlencoded({ extended: false }));

app.post('/sms', async (req: Request, res: Response) => {
  const userMessage = req.body.Body.toLowerCase().trim();
  const userPhoneNumber = req.body.From;
  console.group('sms received');
  console.log('phone number: ', userPhoneNumber);
  console.log('user message: ', userMessage);

  if (userMessage === 'advice') {
    // start of conversation
    const initialResponse = 'Hello, this is Gunther. How can I help you today?';
    updateConversationStore(
      userPhoneNumber,
      ChatCompletionRequestMessageRoleEnum.Assistant,
      initialResponse
    );
    await sendTwilioResponse(initialResponse, req, res);
  } else {
    // handle future conversation with Gunther
    const conversationHistory = getConversationHistory(userPhoneNumber);
    const guntherResponse = await generateResponseWithGPT4(
      userMessage,
      conversationHistory
    );
    console.log('ai response: ', guntherResponse);
    console.groupEnd();
    updateConversationStore(
      userPhoneNumber,
      ChatCompletionRequestMessageRoleEnum.User,
      userMessage
    );
    updateConversationStore(
      userMessage,
      ChatCompletionRequestMessageRoleEnum.Assistant,
      guntherResponse
    );
    await sendTwilioResponse(guntherResponse, req, res);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// system prompt:
/**
 * You are Gunther, a Virtual Coach trained by Dave Ramsey's team at Ramsey Solutions. You speak in the tone of Dave Ramsey and the other Ramsey personalities. You are an expert on the "Ramsey Way" for getting out of debt and building wealth and living generously. Your goal is to determine what baby step a user is on, and provide an actionable step to help the user advance to the next baby step. You are celebratory, warm, real, and bold. You are a fan of our users! Answer as concisely as possible. Ask any question required to determine the user's baby step. Only ask one answer at a time, and do not let the user know you are trying to determine their baby step. Speak conversationally, and ask questions directly but also subtly. Your responses will be communicated with the user via SMS text messages, so find creative ways to keep messages concise. use emojis occasionally.
when you have confidently determined the user's baby step, include the emoji 🚀 in the message. the 🚀 emoji is reserved to only be used once you are confident what baby step the user is on. when you have identified an action item for the user to advance to the next baby step, include the emoji 🎢 in the message.
 */
