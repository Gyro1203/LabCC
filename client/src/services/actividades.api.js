import axios from 'axios';

export const getActividadesRequest = async () => {
    const response = await axios.get('http://localhost:3000/activity');
    return response.data;
};

export const getActividadByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/activity/${id}`);
    return response.data;
}

export const getActividadByIngresoRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/activity/entry/${id}`);
    return response.data;
}

export const createActividadesRequest = async (actividad) => {
    console.log("Actividad a enviar:", actividad);
    const response = await axios.post('http://localhost:3000/activity', actividad);
    return response.data;
};

export const updateActividadesRequest = async (id, actividad) => {
    return await axios.put(`http://localhost:3000/activity/${id}`, actividad);
}

export const deleteActividadesRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/activity/${id}`);
};