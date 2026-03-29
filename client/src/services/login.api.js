import axios from 'axios';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// login
export const loginRequest = async (email, password) => {
  try {
    const response = await axios.post(BASE_URL + `/login`, {
      email,
      password,
    });
    const { status, data } = response;
    if (status === 200) {
      const { nombre_usuario, email, rut, rol } = jwtDecode(data.data.token); // Decodifica el token
      const userData = { nombre_usuario, email, rut, rol }; // Datos del usuario
      sessionStorage.setItem("usuario", JSON.stringify(userData)); // Guarda los datos del usuario en sessionStorage
      axios.defaults.headers.common[ 
        "Authorization"
      ] = `Bearer ${data.data.token}`; // Configura el token en los headers de axios
      cookies.set("jwt-auth", data.data.token, { path: "/" }); // Guarda el token en cookies
      return response.data;
    }
  } catch (error) {
    return error.response.data;
  }
};

// logout
export const logoutRequest = async () => {
    try {
      await axios.post(BASE_URL + `/logout`);
      sessionStorage.removeItem("usuario"); // Elimina los datos del usuario de sessionStorage
      cookies.remove("jwt"); // Elimina el token de las cookies
      cookies.remove("jwt-auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

}


