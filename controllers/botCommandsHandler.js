const localFxService = require('../services/localFxService');
const binanceService = require('../services/binanceService');
const calcService = require('../services/calcService');
const util = require('../utils/dateUtil');

const ACCURACY_WARNING = '❗ The rate calculated is not based on available amount so it may not be accurate.' ;

const sendTypingChatAction = async(ctx) => {
  await ctx.replyWithChatAction('typing');
};

exports.handleStart = async(ctx) => {
  console.log(JSON.stringify(ctx));
  return await ctx.reply('👋 Hi! Welcome to Min\'s FX Bot. 🤖💬\nSend me a command from (☰ Menu) below.');
};

exports.handleLocalThaiFx = async(ctx) => {
  await sendTypingChatAction(ctx);
  try {
    const rate = await localFxService.getSuperRichRate();
    return await ctx.reply('📅 ' + rate.lastUpdated +
      '\n\nBUYING: ฿' + rate.buying + 
      '\nSELLING: ฿' + rate.selling + ' (฿' + rate.sellingClean + ' for clean notes)' +
      '\n\nsource: SuperRichTH\n\n#local_usdthbusd');
  } catch(error) {
    return await ctx.reply(error.message);
  }
};

exports.handleBinanceThaiFx = async(ctx, type) => {
  await sendTypingChatAction(ctx);
  let ads;
  try {
    if (type === 'usdthb') {
      ads = await binanceService.getTopUsdThb();
    } else if (type === 'thbusd') {
      ads = await binanceService.getTopThbUsd();
    }
    const reply = getBinanceReply(ads, type);
    return await ctx.reply(reply);
  } catch(error) {
    return await ctx.reply(error.message);
  }
};

exports.handleBinanceMyanmarFx = async(ctx, type) => {
  await sendTypingChatAction(ctx);
  let ads;
  try {
    if (type === 'usdmmk') {
      ads = await binanceService.getTopUsdMmk();
    } else if (type === 'mmkusd') {
      ads = await binanceService.getTopMmkUsd();
    }
    const reply = getBinanceReply(ads, type);
    return await ctx.reply(reply);
  } catch(error) {
    return await ctx.reply(error.message);
  }
};

exports.handleRequiredArgument = async(ctx) => {
  await sendTypingChatAction(ctx);
  switch(ctx.message.text) {
    case '/calc_cashout_usd':
      const markdownReply = 'Send me the amount of USD\\.\neg: `' + ctx.message.text + ' 100`\n\\(Click command to copy\\)';
      return await ctx.replyWithMarkdownV2(markdownReply);
    default: return await ctx.reply('Not supported.');
  }
};

exports.handleCalculateCashoutUsd = async(ctx) => {
  await sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  if (!!amount && (isNaN(amount) || amount <= 0)) {
    return await ctx.reply('Enter a valid amount in numbers only.');
  }
  try {
    const data = await calcService.calculateCashoutUsd(parseFloat(amount));
    return await ctx.reply('📅 ' + util.getCurrentDate() +
      '\n\nIf you SELL ' + data.cashoutUsdAmount.toLocaleString() + ' USDT @ ' + data.p2pPrice.toLocaleString() +
      '\n👤 ' + data.p2pUser +
      '\n\nand BUY @ ' + data.localPrice.toFixed(2).toLocaleString() +
      '\n👤 SuperRich (new notes)' +
      '\n\nYou GET ' + data.cashoutUsdAmount.toLocaleString() + ' 💵' +
      '\nand ' + (data.difference <= 0 ? 'LOST' : 'PROFIT') + ' ' + Math.abs(data.difference).toFixed(2).toLocaleString() + ' USD. (' + (data.difference * data.localPrice).toFixed(2).toLocaleString() + ' THB)');
  } catch(error) {
    return ctx.reply(error.message);
  }
};

exports.handleCalculateBahtToKyat = async(ctx) => {
  await sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  const isAmountProvided = !!amount;
  if (isAmountProvided && (isNaN(amount) || amount <= 0)) {
    return ctx.reply('The amount you provided is not valid.');
  }
  try {
    let data = await calcService.calculateBahtToKyat(isAmountProvided ? parseFloat(amount) : undefined);
    console.log(JSON.stringify(data));
    await ctx.reply('📅 ' + util.getCurrentDate() +
      '\n\nIf you BUY' +
      (data.usdAmount ? (' ' + data.usdAmount.toLocaleString()) : '') +
      ' USD @ ' + data.usdThbPrice.toLocaleString() +
      (data.thbAmount ? (' = ' + data.thbAmount.toLocaleString() + ' THB') : '') +
      (isAmountProvided ? ('\n👤 ' + data.usdThbUsername) : '') +
      '\n\nand SELL @ ' + data.usdMmkPrice.toLocaleString() + ' MMK' +
      (isAmountProvided ? ('\n👤 ' + data.usdMmkUsername + '\n💳 ' + data.usdMmkPayments) : '') +
      '\n\n✅ 1 THB = ' + data.thbMmkPrice.toLocaleString() + ' MMK\n✅ 1 Lakh MMK = ' + data.mmkThbPrice.toLocaleString() + ' THB' + 
      (!isAmountProvided ? '\n\n' + ACCURACY_WARNING : '') +
      '\n\n#' + (isAmountProvided ? 'thbmmk' : 'thbmmk_avg'));
    if (!isAmountProvided) {
      const accuracyReplyMsg = 'For more accuracy, send command with the amount\\.\neg\\. `' + ctx.message.text + ' 10000`\n\\(Click command to copy\\)';
      await ctx.replyWithMarkdownV2(accuracyReplyMsg);
    }
  } catch(error) {
    return await ctx.reply(error.message);
  }
};

exports.handleCalculateKyatToBaht = async(ctx) => {
  await sendTypingChatAction(ctx);
  const amount = ctx.match[1];
  const isAmountProvided = !!amount;
  if (isAmountProvided && (isNaN(amount) || amount <= 0)) {
    return await ctx.reply('The amount you provided is not valid.');
  }
  try {
    let data = await calcService.calculateKyatToBaht(isAmountProvided ? parseFloat(amount) : undefined);
    await ctx.reply('📅 ' + util.getCurrentDate() +
      '\n\nIf you BUY' +
      (data.usdAmount ? (' ' + data.usdAmount.toLocaleString()) : '') + ' USD x ' + data.usdMmkPrice.toLocaleString() +
      (data.mmkAmount ? (' = ' + data.mmkAmount.toLocaleString() + ' MMK') : '') +
      (isAmountProvided ? ('\n👤 ' + data.usdMmkUsername + '\n💳 ' + data.usdMmkPayments) : '') +
      '\n\nand SELL x ' + data.usdThbPrice.toLocaleString() + ' THB' +
      (isAmountProvided ? ('\n👤 ' + data.usdThbUsername) : '') +
      '\n\n✅ 1 THB = ' + data.thbMmkPrice.toLocaleString() + ' MMK\n✅ 1 Lakh MMK = ' + data.mmkThbPrice.toLocaleString() + ' THB' +
      (!isAmountProvided ? '\n\n' + ACCURACY_WARNING : '') +
      '\n\n#' + (isAmountProvided ? 'mmkthb' : 'mmkthb_avg'));
    if (!isAmountProvided) {
      const accuracyReplyMsg = 'For more accuracy, send command with the amount\\.\neg\\. `' + ctx.message.text + ' 100000`\n\\(Click command to copy\\)';
      await ctx.replyWithMarkdownV2(accuracyReplyMsg);
    }
  } catch(error) {
    return await ctx.reply(error.message);
  }
};

const getBinanceReply = (ads, type) => {
  let reply = '📅 ' + util.getCurrentDate();
  ads.forEach((ad, index) => {
    reply = reply + ('\n\n' + (index + 1) + ') 👤 ' + ad.username);
    reply = reply + (`\nPrice: ${ad.symbol}${ad.price.toLocaleString()}`);
    reply = reply + (`\nAvailable: ${ad.quantity.toLocaleString()} USDT`);
    reply = reply + (`\nLimit: ${ad.symbol}${ad.minSingleAmount.toLocaleString()} - ${ad.symbol}${ad.dynamicMaxSingleAmount.toLocaleString()}`);
    reply = reply + ('\nPayment Methods: ' + ad.payments);
  });
  return reply + '\n\n#' + type;
};

exports.handleUnsupportedCommand = (ctx) => {
  return ctx.reply('Command not supported');
};
