import axios from 'axios';

export const getUsuariosRequest = async () => {
    const response = await axios.get('http://localhost:3000/users');
    return response.data;
};

export const getUsuarioByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/users/${id}`);
    return response.data;
}

export const createUsuariosRequest = async (alumn) => {
    const response = await axios.post('http://localhost:3000/users', alumn);
    return response.data;
};

export const updateUsuariosRequest = async (id, alumn) => {
    return await axios.put(`http://localhost:3000/users/${id}`, alumn);
}

export const deleteUsuariosRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/users/${id}`);
};