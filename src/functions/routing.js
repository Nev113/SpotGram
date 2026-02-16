import axios from "axios";

const URL_API = process.env.URL_API;

const getData = (url) => {
  try {
    const response = axios.get(url, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export { URL_API, getData };
