import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getUsuariosRequest = async () => {
    const response = await axios.get(BASE_URL + '/users');
    return response.data;
};

export const getUsuarioByIdRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/users/${id}`);
    return response.data;
}

export const createUsuariosRequest = async (user) => {
    const response = await axios.post(BASE_URL + '/users', user);
    return response.data;
};

export const updateUsuariosRequest = async (id, user) => {
    return await axios.put(BASE_URL + `/users/${id}`, user);
}

export const deleteUsuariosRequest = async (id) => {
    return await axios.delete(BASE_URL + `/users/${id}`);
};