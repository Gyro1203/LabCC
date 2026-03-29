import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAsistenciasRequest = async () => {
    const response = await axios.get(BASE_URL + '/attendance');
    return response.data;
};

export const getAsistenciaByIdRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/attendance/${id}`);
    return response.data;
}

export const getAsistenciaByIngresoRequest = async (id) => {
    const response = await axios.get(BASE_URL + `/attendance/entry/${id}`);
    return response.data;
}

export const createAsistenciasRequest = async (asistencia) => {
    const response = await axios.post(BASE_URL + '/attendance', asistencia);
    return response.data;
};

export const updateAsistenciasRequest = async (id, asistencia) => {
    return await axios.put(BASE_URL + `/attendance/${id}`, asistencia);
}

export const marcarSalidaRequest = async (id, asistencia) => {
    return await axios.put(BASE_URL + `/attendance/mark/${id}`, asistencia);
}

export const deleteAsistenciasRequest = async (id) => {
    return await axios.delete(BASE_URL + `/attendance/${id}`);
};