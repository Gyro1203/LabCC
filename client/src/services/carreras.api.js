import axios from "axios";

export const getCarrerasRequest = async () => {
  const response = await axios.get("http://localhost:3000/careers");
  return response.data;
};