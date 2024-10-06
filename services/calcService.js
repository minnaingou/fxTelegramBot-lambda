const binanceService = require('./binanceService');
const localFxService = require('./localFxService');

exports.calculateCashoutUsd = async(cashoutUsdAmt) => {
  try {
    const localRate = await localFxService.getSuperRichRate();
    const p2pResponse = await binanceService.getTopUsdThbByThbAmount(localRate.buying * cashoutUsdAmt);
    if (!p2pResponse) {
      throw new Error('No listings found on Binance.');
    }
    const bestBuyingP2P = p2pResponse[0];
    const calculatedData = {
      cashoutUsdAmount: cashoutUsdAmt,
      p2pPrice: bestBuyingP2P.price,
      p2pUser: bestBuyingP2P.username,
      p2pPaymentMethods: bestBuyingP2P.payments,
      localPrice: localRate.selling + 0.05
    };
    return {
      ...calculatedData,
      difference: ((cashoutUsdAmt * calculatedData.p2pPrice) / calculatedData.localPrice).toFixed(2) - cashoutUsdAmt
    };
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.calculateBahtToKyat = async(thbAmount) => {
  try {
    const isAmountProvided = !!thbAmount;
    const p2pThbUsd = await binanceService.getTopThbUsdByThbAmount(thbAmount);
    const bestThbUsd = p2pThbUsd[0];
    const usdAmount = isAmountProvided ? (thbAmount / bestThbUsd.price) : undefined;
    const p2pUsdMmk = await binanceService.getTopUsdMmkByUsdAmount(usdAmount);
    const bestUsdMmk = p2pUsdMmk[0];
    const bestThbMmk = bestUsdMmk.price / bestThbUsd.price;
    return {
      thbAmount: thbAmount,
      usdThbPrice: bestThbUsd.price,
      usdThbUsername: bestThbUsd.username,
      usdAmount: usdAmount ? usdAmount.toFixed(2) : undefined,
      usdMmkPrice: bestUsdMmk.price,
      usdMmkUsername: bestUsdMmk.username,
      usdMmkPayments: bestUsdMmk.payments,
      thbMmkPrice: bestThbMmk.toFixed(2),
      mmkThbPrice: (100000/bestThbMmk).toFixed(2)
    };
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.calculateKyatToBaht = async(mmkAmount) => {
  try {
    const isAmountProvided = !!mmkAmount;
    let p2pMmkUsd = await binanceService.getTopMmkUsdByMmkAmount(mmkAmount);
    const bestMmkUsd = p2pMmkUsd[0];
    const usdAmount = isAmountProvided ? (mmkAmount / bestMmkUsd.price) : undefined;
    let p2pUsdThb = await binanceService.getTopUsdThbByUsdAmount(usdAmount);
    const bestUsdThb = p2pUsdThb[0];
    const bestThbMmk = bestMmkUsd.price / bestUsdThb.price;
    return {
      mmkAmount: mmkAmount,
      usdMmkPrice: bestMmkUsd.price,
      usdMmkUsername: bestMmkUsd.username,
      usdMmkPayments: bestMmkUsd.payments,
      usdAmount: usdAmount ? usdAmount.toFixed(2) : undefined,
      usdThbPrice: bestUsdThb.price,
      usdThbUsername: bestUsdThb.username,
      thbMmkPrice: bestThbMmk.toFixed(2),
      mmkThbPrice: (100000/bestThbMmk).toFixed(2)
    };
  } catch(error) {
    console.error(error);
    throw error;
  }
};
