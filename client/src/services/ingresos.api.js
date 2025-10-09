import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getIngresosRequest = async () => {
    const response = await axios.get(BASE_URL + '/entry');
    return response.data;
};

export const getIngresoByIdRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/entry/${id}`);
    return response.data;
}

export const getIngresoByAlumnoRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/entry/student/${id}`);
    return response.data;
}

export const createIngresosRequest = async (ingreso) => {
    const response = await axios.post(BASE_URL + '/entry', ingreso);
    return response.data;
};

export const updateIngresosRequest = async (id, ingreso) => {
    console.log("Ingreso recibido: ", ingreso)
    return await axios.put(BASE_URL + `/entry/${id}`, ingreso);
}

export const deleteIngresosRequest = async (id) => {
    return await axios.delete(BASE_URL + `/entry/${id}`);
};