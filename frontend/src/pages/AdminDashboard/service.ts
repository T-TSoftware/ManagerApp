import axios from "axios";

export const getEURCurrency = async () => {
  const res = await axios.get(
    `https://api.frankfurter.app/latest?from=EUR&to=TRY`
  );
  console.log(res);
  return res.data.rates.TRY;
};

export const getUSDCurrency = async () => {
  const res = await axios.get(
    `https://api.frankfurter.app/latest?from=USD&to=TRY`
  );
  return res.data.rates.TRY;
};
