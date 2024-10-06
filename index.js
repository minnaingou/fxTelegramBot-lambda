const { Telegraf } = require('telegraf');
const controller = require('./controllers/botCommandsHandler');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(controller.handleStart);
bot.hears('/local_thb', controller.handleLocalThaiFx);
bot.hears('/p2p_usdthb', (ctx) => controller.handleBinanceThaiFx(ctx, 'usdthb'));
bot.hears('/p2p_thbusd', (ctx) => controller.handleBinanceThaiFx(ctx, 'thbusd'));
bot.hears('/p2p_usdmmk', (ctx) => controller.handleBinanceMyanmarFx(ctx, 'usdmmk'));
bot.hears('/p2p_mmkusd', (ctx) => controller.handleBinanceMyanmarFx(ctx, 'mmkusd'));
bot.hears('/p2p_mmkusd', (ctx) => controller.handleBinanceMyanmarFx(ctx, 'mmkusd'));
bot.hears('/calc_cashout_usd', (ctx) => controller.controllerequiredArgument(ctx, 'calc_cashout_usd'));
bot.hears(/\/calc_cashout_usd\s(\d+)/i, controller.handleCalculateCashoutUsd);
bot.hears('/calc_thbmmk', (ctx) => controller.controllerequiredArgument(ctx, 'calc_thbmmk'));
bot.hears(/\/calc_thbmmk\s(\d+)/i, controller.handleCalculateBahtToKyat);
bot.hears('/calc_mmkthb', (ctx) => controller.controllerequiredArgument(ctx, 'calc_mmkthb'));
bot.hears(/\/calc_mmkthb\s(\d+)/i, controller.handleCalculateKyatToBaht);
bot.on('message', controller.handleUnsupportedCommand);

exports.fxBot = async (req) => {
  console.log(req);
  try {
    await bot.handleUpdate(JSON.parse(req.body));
    return 'OK';
  } catch (error) {
    console.error(error);
    return 'ERROR';
  }
};
