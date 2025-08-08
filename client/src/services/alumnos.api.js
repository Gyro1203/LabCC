import axios from "axios";

export const getAlumnosRequest = async () => {
  const response = await axios.get("http://localhost:3000/students");
  return response.data;
};

export const getAlumnoByIdRequest = async (id) => {
  const response = await axios.get(`http://localhost:3000/students/${id}`);
  return response.data;
};

export const createAlumnosRequest = async (alumn) => {
  const response = await axios.post("http://localhost:3000/students", alumn);
  return response.data;
};

export const updateAlumnosRequest = async (id, alumn) => {
  const response = await axios.put(
    `http://localhost:3000/students/${id}`,
    alumn
  );
  return response.data;
};

export const deleteAlumnosRequest = async (id) => {
  const response = await axios.delete(`http://localhost:3000/students/${id}`);
  return response.data;
};
