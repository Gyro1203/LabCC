import axios from 'axios';

export const loginRequest = async (email, password) => {
    const response = await axios.post(`http://localhost:3000/login`, {
        email,
        password
    });
    return response.data;
}

export const logoutRequest = async () => {
    const response = await axios.get(`http://localhost:3000/logout`);
    return response.data;
}

