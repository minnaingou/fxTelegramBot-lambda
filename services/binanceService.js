const axios = require('axios');

const p2pTemplate = {
  asset: 'USDT',
  merchantCheck: true,
  page: 1,
  publisherType: null
};

const binanceP2PApi = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
  headers: { 
    'Content-Type': 'application/json'
  }
};

const extractAdsInfo = (ads) => {
  const excludedPayments = process.env.EXCLUDED_PAYMENTS.split(',');
  return ads
    .filter(ad => {
        const tradeMethods = ad.adv.tradeMethods.map(method => method.tradeMethodName);
        return !tradeMethods.every(method => excludedPayments.includes(method));
    })
    .map(ad => ({
      price: parseFloat(ad.adv.price),
      symbol: ad.adv.fiatSymbol,
      minSingleAmount: parseFloat(ad.adv.minSingleTransAmount),
      maxSingleAmount: parseFloat(ad.adv.maxSingleTransAmount),
      dynamicMaxSingleAmount: parseFloat(ad.adv.dynamicMaxSingleTransAmount),
      minSingleQuantity: parseFloat(ad.adv.minSingleTransQuantity),
      maxSingleQuantity: parseFloat(ad.adv.maxSingleTransQuantity),
      dynamicMaxSingleQuantity: parseFloat(ad.adv.dynamicMaxSingleTransQuantity),
      quantity: parseFloat(ad.adv.tradableQuantity),
      payments: ad.adv.tradeMethods.map(method => method.tradeMethodName).join(', '),
      username: `${ad.advertiser.nickName} (trades: ${ad.advertiser.monthOrderCount})`
    }));
};

exports.getTopUsdThb = async() => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'THB',
      tradeType: 'SELL',
      rows: 10
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-THB listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopUsdThbByThbAmount = async(amountInThb) => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'THB',
      tradeType: 'SELL',
      transAmount: amountInThb,
      rows: 10
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-THB listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopUsdThbByUsdAmount = async(amountInUsd) => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'THB',
      tradeType: 'SELL',
      rows: 20
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-THB listings were found from top sellers. Try adjusting the amount.');
    }
    let matchingAds;
    if (amountInUsd) {
      matchingAds = ads.filter(ad => ad.adv.tradableQuantity >= amountInUsd);
    } else {
      matchingAds = ads;
    }
    if (!matchingAds) {
      throw new Error('No USD-MMK listings that match the quantity were found.');
    }
    return extractAdsInfo(matchingAds);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopThbUsd = async() => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'THB',
      tradeType: 'BUY',
      rows: 10
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No THB-USD listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopThbUsdByThbAmount = async(amountInThb) => {
  try {
    const requestPayload = {
      ...p2pTemplate,
      fiat: 'THB',
      tradeType: 'BUY',
      rows: 20
    };
    if (amountInThb) requestPayload['transAmount'] = amountInThb;
    const response = await axios.request({...binanceP2PApi, data: requestPayload});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No THB-USD listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopUsdMmk = async() => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'MMK',
      tradeType: 'SELL',
      rows: 10
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-MMK listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopUsdMmkByUsdAmount = async(amountInUsd) => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'MMK',
      tradeType: 'SELL',
      rows: 20
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-MMK listings were found from top sellers. Try adjusting the amount.');
    }
    let matchingAds;
    if (amountInUsd) {
      matchingAds = ads.filter(ad => ad.adv.tradableQuantity >= amountInUsd);
    } else {
      matchingAds = ads;
    }
    if (!matchingAds) {
      throw new Error('No USD-MMK listings that match the quantity were found.');
    }
    return extractAdsInfo(matchingAds);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopMmkUsd = async() => {
  try {
    const response = await axios.request({...binanceP2PApi, data: {
      ...p2pTemplate,
      fiat: 'MMK',
      tradeType: 'BUY',
      rows: 10
    }});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No MMK-USD listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};

exports.getTopMmkUsdByMmkAmount = async(amountInMmk) => {
  try {
    const requestPayload = {
      ...p2pTemplate,
      fiat: 'MMK',
      tradeType: 'BUY',
      rows: 20
    };
    if (amountInMmk) requestPayload['transAmount'] = amountInMmk;
    const response = await axios.request({...binanceP2PApi, data: requestPayload});
    const ads = response?.data?.data;
    if (!ads || !ads.length) {
      throw new Error('No USD-MMK listings were found.');
    }
    return extractAdsInfo(ads);
  } catch(error) {
    console.error(error);
    throw error;
  }
};
