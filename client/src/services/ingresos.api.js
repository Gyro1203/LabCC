import axios from 'axios';

export const getIngresosRequest = async () => {
    const response = await axios.get('http://localhost:3000/entry');
    return response.data;
};

export const getIngresoByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/entry/${id}`);
    return response.data;
}

export const createIngresosRequest = async (ingreso) => {
    const response = await axios.post('http://localhost:3000/entry', ingreso);
    return response.data;
};

export const updateIngresosRequest = async (id, ingreso) => {
    return await axios.put(`http://localhost:3000/entry/${id}`, ingreso);
}

export const deleteIngresosRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/entry/${id}`);
};