import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getEnsayosRequest = async () => {
    const response = await axios.get(BASE_URL + '/essay');
    return response.data;
};

export const getEnsayoByIdRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/essay/${id}`);
    return response.data;
}

export const createEnsayosRequest = async (ensayo) => {
    const response = await axios.post(BASE_URL + '/essay', ensayo);
    return response.data;
};

export const updateEnsayosRequest = async (id, ensayo) => {
    return await axios.put(BASE_URL + `/essay/${id}`, ensayo);
}

export const deleteEnsayosRequest = async (id) => {
    return await axios.delete(BASE_URL + `/essay/${id}`);
};