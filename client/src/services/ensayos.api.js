import axios from 'axios';

export const getEnsayosRequest = async () => {
    const response = await axios.get('http://localhost:3000/essay');
    return response.data;
};

export const getEnsayoByIdRequest = async (id) => {
    const response = await axios.get(`http://localhost:3000/essay/${id}`);
    return response.data;
}

export const createEnsayosRequest = async (ensayo) => {
    const response = await axios.post('http://localhost:3000/essay', ensayo);
    return response.data;
};

export const updateEnsayosRequest = async (id, ensayo) => {
    return await axios.put(`http://localhost:3000/essay/${id}`, ensayo);
}

export const deleteEnsayosRequest = async (id) => {
    return await axios.delete(`http://localhost:3000/essay/${id}`);
};