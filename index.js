const { Telegraf } = require('telegraf');
const controller = require('./controllers/botCommandsHandler');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(controller.handleStart);
bot.command('local_thb', controller.handleLocalThaiFx);
bot.command('p2p_usdthb', (ctx) => controller.handleBinanceThaiFx(ctx, 'usdthb'));
bot.command('p2p_thbusd', (ctx) => controller.handleBinanceThaiFx(ctx, 'thbusd'));
bot.command('p2p_usdmmk', (ctx) => controller.handleBinanceMyanmarFx(ctx, 'usdmmk'));
bot.command('p2p_mmkusd', (ctx) => controller.handleBinanceMyanmarFx(ctx, 'mmkusd'));
bot.hears('/calc_cashout_usd', controller.handleRequiredArgument);
bot.hears(/\/calc_cashout_usd\s(\d+)/i, controller.handleCalculateCashoutUsd);
bot.hears('/calc_thbmmk', controller.handleCalculateBahtToKyat);
bot.hears(/\/calc_thbmmk\s+(\d+)/i, controller.handleCalculateBahtToKyat);
bot.hears('/calc_mmkthb', controller.handleCalculateKyatToBaht);
bot.hears(/\/calc_mmkthb\s+(\d+)/i, controller.handleCalculateKyatToBaht);
bot.on('message', controller.handleUnsupportedCommand);

exports.fxBot = async (req) => {
  try {
    await bot.handleUpdate(JSON.parse(req.body));
    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
