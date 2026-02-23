import axios from "axios";

const URL_API = import.meta.env.VITE_URL_API;

const getData = async (path) => {
  try {
    const response = await axios.get(URL_API + path);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export { URL_API, getData };
