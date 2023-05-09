const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');
const openai = require('openai');
require('dotenv').config();

const PORT = process.env.PORT || 1337;

openai.apiKey = process.env.OPENAI_API_KEY;

const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendTwilioResponse(response, req, res) {
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
  const userMessage = req.body.Body.toLowerCase().trim();

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
