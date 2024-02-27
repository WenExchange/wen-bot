"use strict";

require("dotenv").config();

const cron = require("node-cron");
const wen = require("./wen_contract");

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(process.env.TESTNET_RPC_URL);

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const telegramBot = new TelegramBot(token, { polling: true });
// Chat room
const chatId = process.env.TELEGRAM_CHAT_ID;

// 1. Claim All Yields
cron.schedule(
  "00 23 * * *",
  function () {
    wen
      .claimAllBlastYieldFromWenTradePool()
      .then((object) => {
        successYield(object);
      })
      .catch((e) => {
        errorJob(e, "Scheduled Another Try After 5 Minutes.");
      });
  },
  {
    timezone: "Asia/Seoul",
  }
);

cron.schedule(
  "00 11 * * *",
  function () {
    wen
      .claimAllBlastYieldFromWenTradePool()
      .then((object) => {})
      .catch((e) => {
        errorJob(e, "Scheduled Another Try After 5 Minutes.");
      });
  },
  {
    timezone: "Asia/Seoul",
  }
);

// 2. Claim Gas Fee
cron.schedule(
  "50 23 * * *",
  function () {
    wen
      .claimAllGasFees()
      .then((object) => {
        wen
          .distributeGasFees()
          .then((object) => {
            console.log("distributeGasFees Succeed!");
          })
          .catch((e) => {
            errorJob(e, "distributeGasFees error");
          });
      })
      .catch((e) => {
        errorJob(e, "Scheduled Another Try After 5 Minutes.");
      });
  },
  {
    timezone: "Asia/Seoul",
  }
);

function getCurrentDateTime() {
  var options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZoneName: "short",
    weekday: "short",
  };
  var date = new Date();
  options.timeZone = "America/New_York";
  return date.toLocaleDateString("en-US", options);
}
console.log(getCurrentDateTime());

function successYield(object) {
  const msg = `

<b>\n Just Claimed Blast Native Yield!🌾</b> 

✰ <code>Date</code> 
 ➯${getCurrentDateTime()}
✰ <code>Claimed ETH</code> 
 ➯${toEther(object.claimedETH).toString()} ETH
✰ <code>Used Gas</code> 
 ➯${toEther(object.usedETHForGas).toString()} ETH
✰ <code>Wen Trade Pool Balance</code> 
 ➯${toEther(object.contractEthBalance).toString()} ETH

<a href="https://testnet.blastscan.io/tx/${object.txHash}">View The TX 🔗</a>

🔗 Official Links
<a href="https://wen.exchange">Wen Website</a>  |  <a href="https://twitter.com/wen_exchange">X</a>  |  <a href="https://docs.wen.exchange">Docs</a>

`;

  telegramBot.sendMessage(chatId, msg, { parse_mode: "HTML" });
}

function toEther(num) {
  return parseFloat(web3.utils.fromWei(num, "ether")).toFixed(18);
}
