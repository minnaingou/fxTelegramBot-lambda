const axios = require('axios');
const util = require('../utils/dateUtil');

const superRichApi = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.superrichthailand.com/api/v1/rates',
  headers: {
    Referer: 'https://www.superrichthailand.com/',
    Authorization: process.env.SUPERRICH_TOKEN,
  },
};

exports.getSuperRichRate = async () => {
  try {
    const response = await axios.request(superRichApi);
    const exchangeRates = response?.data?.data?.exchangeRate;
    if (!exchangeRates) {
      throw new Error('No exchange rate found');
    }
    const usdHundredDenomRate = exchangeRates
      .find(currency => currency.cUnit === 'USD')
      .rate
      .find(usdRate => usdRate.denom === '100');
    return {
      lastUpdated: util.convertDate(usdHundredDenomRate.dateTime),
      buying: usdHundredDenomRate.cBuying,
      selling: usdHundredDenomRate.cSelling,
      sellingClean: (usdHundredDenomRate.cSelling + 0.05).toFixed(2)
    };
  } catch(error) {
    console.error(error);
    throw error;
  }
};
