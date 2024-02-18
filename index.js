"use strict";

require("dotenv").config();

const cron = require("node-cron");
const wen = require("./wen_contract");

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
        vxSHOSnapshotSuccessJob(object);
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

function successYield(object) {
  const currentDate = new Date();

  const msg = `

<b>\n Just Claimed Blast Native Yield!🌾</b> 

<code>Date</code> 
${currentDate}
<code>Claimed ETH</code> 
${object.claimedETH}ETH
<code>Used Gas</code> 
${object.usedETHForGas}ETH
<code>Wen Trade Pool Balance</code> 
 ETH

<a href="https://testnet.blastscan.io/tx/${}">View The TX 🔗</a>


🔗 Official Links
<a href="https://wen.exchange">Wen Website</a>  |  <a href="https://twitter.com/wen_exchange">X</a>  |  <a href="https://docs.wen.exchange">Docs</a>

`;

  telegramBot.sendMessage(chatId, msg, { parse_mode: "HTML" });
}
