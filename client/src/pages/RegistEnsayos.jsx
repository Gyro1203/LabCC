import { Form, Formik } from 'formik';
import { createEnsayosRequest, getEnsayoByIdRequest, updateEnsayosRequest } from '../services/ensayos.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RegistEnsayos() {

    const navigate = useNavigate();

    const [ensayo, setEnsayo] = useState({
        nombre: '',
        tipo: '',
        precio_uf: ''
    }); // Estado para almacenar el ensayo si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect( () => {
    const fetchEnsayo = async () => {
      if (params.id) {
        try {
          const ensayo = await getEnsayoByIdRequest(params.id);
          console.log('Ensayo encontrado:', ensayo);
          setEnsayo(ensayo);
        } catch (error) {
          console.error('Error al obtener el ensayo:', error);
        }
      }
    };
    fetchEnsayo();
  }, [params.id]);

  return (
    <div>
        <h1>{params.id ? 'Editar datos del ensayo' : 'Registrar nuevo ensayo'}</h1>

        <Formik
            initialValues={ensayo}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values)=>{    
                try {
                    if (params.id) {
                        await updateEnsayosRequest(params.id, values);
                        console.log('Ensayo actualizado:', values);
                    }else{
                        const response = await createEnsayosRequest(values);
                        console.log('Ensayo creado:', response);
                    }
                    setEnsayo({
                        nombre: '',
                        tipo: '',
                        precio_uf: ''
                    });
                    navigate('/essay'); // Redirigir a la lista de ensayos después de crear o actualizar
                } catch (error) {
                    console.error('Error al crear ensayo:', error);
                }
            }}
        >
        {({handleChange, handleSubmit, values, isSubmitting})=>(
            <Form onSubmit={handleSubmit}>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" name="nombre"
                onChange={handleChange}
                value={values.nombre}
                />

                <label htmlFor="tipo">Tipo</label>
                <input type="text" name="tipo"
                onChange={handleChange}
                value={values.tipo}
                />

                <label htmlFor="precio_uf">Precio UF</label>
                <input type="number" name="precio_uf"
                onChange={handleChange}
                value={values.precio_uf}
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registrando..." : "Registrar"}
                </button>
            </Form>
        )}
        </Formik>
    </div>
  )
}