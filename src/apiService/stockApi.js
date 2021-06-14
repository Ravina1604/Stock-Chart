import axios from "axios";

const baseUrl = "https://financialmodelingprep.com/";

export const getHistoricalPrice = async (company) => {
  try {
    const response = await axios.get(baseUrl+`api/v3/historical-price-full/${company}?serietype=line&apikey=demo`);
    return response.data;
  } catch (error) {
    return new Error(error);
  }
};