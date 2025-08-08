import axios from 'axios';

export const getUsuariosRequest = async () => {
    const response = await axios.get('http://localhost:3000/users');
    return response.data;
};

export const getUsuarioByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/users/${id}`);
    return response.data;
}

export const createUsuariosRequest = async (user) => {
    const response = await axios.post('http://localhost:3000/users', user);
    return response.data;
};

export const updateUsuariosRequest = async (id, user) => {
    return await axios.put(`http://localhost:3000/users/${id}`, user);
}

export const deleteUsuariosRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/users/${id}`);
};