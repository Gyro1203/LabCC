import axios from "axios";

const BASE_URL = "http://localhost:3000/careers";

export const getCarrerasRequest = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getCarreraByIdRequest = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCarreraRequest = async (carrera) => {
  // carrera debe ser un objeto: { carrera, facultad, departamento }
  const response = await axios.post(BASE_URL, carrera);
  return response.data;
};

export const updateCarreraRequest = async (id, carrera) => {
  // carrera debe ser un objeto: { carrera, facultad, departamento }
  const response = await axios.put(`${BASE_URL}/${id}`, carrera);
  return response.data;
};

export const deleteCarreraRequest = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};