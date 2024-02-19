# Wen Bot

Wen Bot is a Node.js based automation bot designed to interact with the Ethereum blockchain to claim yields and gas fees for the Wen Trade Pool and Wen Gas Station smart contracts. It leverages the Alchemy Web3 API for blockchain interactions and integrates with Telegram for notifications.

## Features

- **Claim Yields**: Automatically claims all available yields from the Wen Trade Pool at scheduled times.
- **Claim Gas Fees**: Claims all gas fees for transactions related to the Wen Trade Pool and distributes them accordingly.
- **Scheduled Tasks**: Utilizes `node-cron` to schedule yield and gas fee claiming tasks at specific times.
- **Telegram Notifications**: Sends automated notifications to a Telegram channel regarding the status of scheduled tasks.

## Configuration

Before running Wen Bot, you need to configure the following environment variables in a `.env` file:

- `TESTNET_RPC_URL`: The RPC URL of the Ethereum Testnet.
- `PRIVATE_KEY`: The private key of the wallet used for transactions.
- `TELEGRAM_BOT_TOKEN`: The token for the Telegram bot.
- `TELEGRAM_CHAT_ID`: The chat ID of the Telegram channel where notifications will be sent.

## Dependencies

- `@alch/alchemy-web3`: Alchemy Web3 is used for enhanced Ethereum blockchain interactions.
- `dotenv`: Manages environment variables.
- `node-cron`: Used for scheduling tasks.
- `node-telegram-bot-api`: Enables Telegram bot functionalities.
- `bn.js`: A library for handling big numbers in JavaScript.

## Usage

1. **Installation**: Install all dependencies by running `npm install`.
2. **Configuration**: Set up your `.env` file with the required configurations.
3. **Running the Bot**: Start the bot with `node wen_contract.js` (ensure you have the appropriate script entry in your `package.json` or directly run the script file).

## Scheduled Tasks

Wen Bot performs the following tasks automatically based on the schedule defined in the code:

- **Claim All Yields**: Executes twice daily at 11:00 and 23:00 (Asia/Seoul timezone).
- **Claim and Distribute Gas Fees**: Executes daily at 23:50 (Asia/Seoul timezone).

## Notifications

Upon successful execution of scheduled tasks, Wen Bot sends a detailed message to the configured Telegram channel, including:

- Date and time of the claim.
- Amount of ETH claimed.
- Gas used for the transaction.
- Transaction link for verification.

## Security

Ensure that the private key and Telegram bot token are stored securely and are not exposed in the code or any version control systems.

## Contribution

Contributions to the Wen Bot are welcome. Please ensure that you test your changes thoroughly before making a pull request.
