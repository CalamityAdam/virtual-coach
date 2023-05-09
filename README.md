# Virtual Poetry Coach SMS 📲🖋️

Virtual Poetry Coach SMS is a mobile app that helps users improve their poetry skills through engaging with an AI assistant named Gunther. Users can interact with Gunther via SMS, and the assistant will provide a unique poetic challenge to help users expand their creativity and master the art of poetry.

## Table of Contents 📚

- [Features](#features-)
- [Prerequisites](#prerequisites-)
- [Installation](#installation-)
- [Usage](#usage-)
- [Testing](#testing-)
- [Contributing](#contributing-)
- [License](#license-)

## Features 💡

- Simple SMS-based user interface
- Engaging poetic challenges provided by an AI assistant
- Unique 26-word alphabetical response format
- A fun and creative way to practice and improve poetry skills

## Prerequisites 📋

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (version 14.x or higher)
- You have a [Twilio account](https://www.twilio.com/) with a Twilio phone number
- You have access to GPT-4 or GPT-3 through the [OpenAI API](https://beta.openai.com/signup/)

## Installation 🚀

Follow these steps to set up the Virtual Poetry Coach SMS app:

1. Clone the repository:

   ```bash
   git clone https://github.com/calamityadam/virtual-coach.git
   cd virtual-coach
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the project directory and add the following environment variables:

   ```ini
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   OPENAI_API_KEY=your_openai_api_key
   ```

   Replace `your_twilio_account_sid`, `your_twilio_auth_token`, and `your_openai_api_key` with the appropriate values from your Twilio and OpenAI accounts.

## Usage 📱

To run the Virtual Poetry Coach SMS app, follow these steps:

1. Start the server:

   ```bash
   yarn start
   ```

2. Expose your local server to the internet using [ngrok](https://ngrok.com/):

   ```bash
   ngrok http 3000
   ```

3. Update your Twilio phone number's "A MESSAGE COMES IN" webhook URL to point to the ngrok forwarding URL followed by `/sms`. For example:

   ```
   https://12345678.ngrok.io/sms
   ```

4. Start a conversation with Gunther by sending an SMS with the word "poetry" to your Twilio phone number.

## Testing 🧪

To test the app, simply send an SMS to your Twilio phone number. The ngrok forwarding URL will route incoming messages to your local server, allowing you to test the functionality. Remember to keep your local server and ngrok running during testing.

## Contributing 🤝

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## License 📄

This project is licensed under the [MIT License](LICENSE).
