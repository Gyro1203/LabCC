import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAlumnosRequest = async () => {
  const response = await axios.get(BASE_URL + "/students");
  return response.data;
};

export const getAlumnoByIdRequest = async (id) => {
  const response = await axios.get(BASE_URL + `/students/${id}`);
  return response.data;
};

export const createAlumnosRequest = async (alumn) => {
  const response = await axios.post(BASE_URL + "/students", alumn);
  return response.data;
};

export const updateAlumnosRequest = async (id, alumn) => {
  const response = await axios.put(BASE_URL + `/students/${id}`, alumn);
  return response.data;
};

export const deleteAlumnosRequest = async (id) => {
  const response = await axios.delete(BASE_URL + `/students/${id}`);
  return response.data;
};
