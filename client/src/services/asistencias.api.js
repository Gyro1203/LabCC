import axios from 'axios';

export const getAsistenciasRequest = async () => {
    const response = await axios.get('http://localhost:3000/attendance');
    return response.data;
};

export const getAsistenciaByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/attendance/${id}`);
    return response.data;
}

export const createAsistenciasRequest = async (asistencia) => {
    const response = await axios.post('http://localhost:3000/attendance', asistencia);
    return response.data;
};

export const updateAsistenciasRequest = async (id, asistencia) => {
    return await axios.put(`http://localhost:3000/attendance/${id}`, asistencia);
}

export const marcarSalidaRequest = async (id, asistencia) => {
    return await axios.put(`http://localhost:3000/attendance/mark/${id}`, asistencia);
}

export const deleteAsistenciasRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/attendance/${id}`);
};