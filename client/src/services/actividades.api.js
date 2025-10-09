import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getActividadesRequest = async () => {
    const response = await axios.get(BASE_URL + '/activity');
    return response.data;
};

export const getActividadByIdRequest = async (id) => {
    const response = await axios.get(`${BASE_URL}/activity/${id}`);
    return response.data;
}

export const getActividadesByIngresoRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/activity/entry/${id}`);
    return response.data;
}

export const createActividadesRequest = async (actividad) => {
    console.log("Actividad a enviar:", actividad);
    const response = await axios.post(BASE_URL + '/activity', actividad);
    return response.data;
};

export const updateActividadesRequest = async (id, actividad) => {
    return await axios.put(`${BASE_URL}/activity/${id}`, actividad);
}

export const deleteActividadesRequest = async (id) => {
    return await axios.delete(`${BASE_URL}/activity/${id}`);
};