# Telegram Exchange Rate Bot

This is a Telegram bot that retrieves and calculates exchange rates between multiple currencies, including cash-out rates for USDT from Binance. The bot is deployed on AWS Lambda and built using Node.js.

<img width="343" alt="image" src="https://github.com/user-attachments/assets/8ff95e0d-9bc0-4977-ae5e-04e4ac101ce3">

## Features

- Retrieves exchange rates from Binance P2P and a local exchange API.
- Calculates the following currency conversions:
  - USD > THB
  - THB > USD
  - USD > MMK
  - MMK > USD
  - MMK > THB
- Calculates cash-out rates for USDT from Binance.
- Provides exchange rates to users via Telegram.

## Deployment

The bot is designed to be deployed on AWS Lambda and requires the setup of environment variables and dependencies as AWS Lambda layers.

### Prerequisites

1. **Create a Telegram Bot**  
   Use [@BotFather](https://t.me/botfather) on Telegram to create your own bot. You'll receive a bot token which is required for authentication.

2. **Environment Variables**  
   Set the following environment variables for your Lambda function:
   - `BOT_TOKEN`: Your Telegram bot token from @BotFather.
   - `SUPERRICH_TOKEN`: Basic authentication token for accessing the local exchange API.
   - `EXCLUDED_PAYMENTS`: The payment methods to be filtered out in comma separated format. Eg. `Alipay,LINE Pay`

3. **AWS Lambda Layers**  
   Add your Node.js dependencies as an AWS Lambda layer to minimize deployment package size.

### Installation

1. **Clone the Repository**

   ```sh
   git clone https
2. **Install Dependencies**
   ```
   npm install
3. **Configure AWS Lambda**
- Package your project for deployment on AWS Lambda.
- Set up environment variables (BOT_TOKEN, EXCLUDED_PAYMENTS and SUPERRICH_TOKEN) in your Lambda configuration.
- Add your dependencies as an AWS Lambda layer.

### API Details
- Binance P2P API: Used to retrieve the P2P rates for USD, THB, and MMK.
- Local Exchange API: Used to retrieve local exchange rates for more accurate conversions.
*Note: The API contract may change without notice, and the code may need to be adjusted accordingly, as these APIs are not documented for third-party usage.*
