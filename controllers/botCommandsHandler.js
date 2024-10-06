const localFxService = require('../services/localFxService');
const binanceService = require('../services/binanceService');
const calcService = require('../services/calcService');
const util = require('../utils/dateUtil');

const sendTypingChatAction = (ctx) => {
  ctx.replyWithChatAction('typing');
};

exports.handleStart = (ctx) => {
  ctx.reply('👋 Hi! Welcome to Min\'s FX Bot. 🤖💬\nSend me a command from ☰ menu below.');
}

exports.handleLocalThaiFx = async(ctx) => {
  sendTypingChatAction(ctx);
  try {
    const rate = await localFxService.getSuperRichRate();
    ctx.reply('📅 ' + rate.lastUpdated +
      '\n\nBUYING: ฿' + rate.buying + 
      '\nSELLING: ฿' + rate.selling + ' (฿' + rate.sellingClean + ' for clean notes)' +
      '\n\nsource: SuperRichTH');
  } catch(error) {
    ctx.reply(error.message);
  }
}

exports.handleBinanceThaiFx = async(ctx, type) => {
  sendTypingChatAction(ctx);
  let ads;
  try {
    if (type === 'usdthb') {
      ads = await binanceService.getTopUsdThb();
    } else if (type === 'thbusd') {
      ads = await binanceService.getTopThbUsd();
    }
    const reply = getBinanceReply(ads);
    ctx.reply(reply);
  } catch(error) {
    ctx.reply(error.message);
  }
}

exports.handleBinanceMyanmarFx = async(ctx, type) => {
  sendTypingChatAction(ctx);
  let ads;
  try {
    if (type === 'usdmmk') {
      ads = await binanceService.getTopUsdMmk();
    } else if (type === 'mmkusd') {
      ads = await binanceService.getTopMmkUsd();
    }
    const reply = getBinanceReply(ads);
    ctx.reply(reply);
  } catch(error) {
    ctx.reply(error.message);
  }
}

exports.handleRequiredArgument = (ctx, command) => {
  sendTypingChatAction(ctx);
  switch(command) {
    case 'calc_cashout_usd': ctx.reply('Send me the amount of USD.\neg: /' + command + " 100"); break;
    case 'calc_thbmmk': ctx.reply('Send me the amount of THB.\neg: /' + command + " 10000"); break;
    case 'calc_mmkthb': ctx.reply('Send me the amount of THB.\neg: /' + command + " 100000"); break;
  }
}

exports.handleCalculateCashoutUsd = async(ctx) => {
  sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  if (isNaN(amount)) {
    return ctx.reply('Enter a valid amount in numbers only.')
  }
  try {
    const data = await calcService.calculateCashoutUsd(parseFloat(amount));
    ctx.reply('📅 ' + util.getCurrentDate() +
      '\n\nIf you SELL ' + data.cashoutUsdAmount.toLocaleString() + ' USDT @ ' + data.p2pPrice.toLocaleString() +
      '\n👤 ' + data.p2pUser +
      '\n\nand BUY x ' + data.localPrice.toFixed(2).toLocaleString() +
      '\n👤 SuperRich (new notes)' +
      '\n\nYou GET ' + data.cashoutUsdAmount.toLocaleString() + ' 💵' +
      '\nand ' + (data.difference <= 0 ? 'LOST' : 'PROFIT') + ' ' + Math.abs(data.difference).toFixed(2).toLocaleString() + ' USD. (' + (data.difference * data.localPrice).toFixed(2).toLocaleString() + ' THB)');
  } catch(error) {
    ctx.reply(error.message);
  }
}

exports.handleCalculateBahtToKyat = async(ctx) => {
  sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  if (isNaN(amount)) {
    return ctx.reply('Enter a valid amount in numbers only.')
  }
  try {
    const data = await calcService.calculateBahtToKyat(parseFloat(amount));
    ctx.reply('📅 ' + util.getCurrentDate() +
      '\n\nIf you BUY ' + data.usdAmount.toLocaleString() + ' USD x ' + data.usdThbPrice.toLocaleString() +
      ' = ' + data.thbAmount.toLocaleString() + ' THB\n👤 ' + data.usdThbUsername +
      '\n\nand SELL x ' + data.usdMmkPrice.toLocaleString() + ' MMK\n👤 ' + data.usdMmkUsername +
      '\n💳 ' + data.usdMmkPayments +
      '\n\n✅ 1 THB = ' + data.thbMmkPrice.toLocaleString() + ' MMK\n✅ 1 Lakh MMK = ' + data.mmkThbPrice.toLocaleString() + ' THB');
  } catch(error) {
    ctx.reply(error.message);
  }
}

exports.handleCalculateKyatToBaht = async(ctx) => {
  sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  if (isNaN(amount)) {
    return ctx.reply('Enter a valid amount in numbers only.')
  }
  try {
    const data = await calcService.calculateKyatToBaht(parseFloat(amount));
    ctx.reply('📅 ' + util.getCurrentDate() +
        '\n\nIf you BUY ' + data.usdAmount.toLocaleString() + ' USD x ' + data.usdMmkPrice.toLocaleString() +
        ' = ' + data.mmkAmount.toLocaleString() + ' MMK\n👤 ' + data.usdMmkUsername +
        '\n💳 ' + data.usdMmkPayments +
        '\n\nand SELL x ' + data.usdThbPrice.toLocaleString() + ' THB\n👤 ' + data.usdThbUsername +
        '\n\n✅ 1 THB = ' + data.thbMmkPrice.toLocaleString() + ' MMK\n✅ 1 Lakh MMK = ' + data.mmkThbPrice.toLocaleString() + ' THB');
  } catch(error) {
    ctx.reply(error.message);
  }
}

const getBinanceReply = (ads) => {
  let reply = '📅 ' + util.getCurrentDate();
  ads.forEach((ad, index) => {
    reply = reply + ('\n\n' + (index + 1) + ') 👤 ' + ad.username);
    reply = reply + (`\nPrice: ${ad.symbol}${ad.price.toLocaleString()}`);
    reply = reply + (`\nAvailable: ${ad.quantity.toLocaleString()} USDT`);
    reply = reply + (`\nLimit: ${ad.symbol}${ad.minSingleAmount.toLocaleString()} - ${ad.symbol}${ad.dynamicMaxSingleAmount.toLocaleString()}`);
    reply = reply + ('\nPayment Methods: ' + ad.payments);
  });
  return reply;
}

exports.handleUnsupportedCommand = (ctx) => {
  ctx.reply('Command not supported');
}
