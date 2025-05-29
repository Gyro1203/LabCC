import { Form, Formik } from 'formik';
import { createAlumnosRequest, getAlumnoByIdRequest, updateAlumnosRequest } from '../services/alumnos.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RegistAlumnos() {

    const navigate = useNavigate();

    const [alumno, setAlumno] = useState({
        nombre: '',
        rut: '',
        carrera: '',
        facultad: '',
        departamento: ''
    }); // Estado para almacenar el alumno si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect( () => {
    const fetchAlumno = async () => {
      if (params.id) {
        try {
          const alumno = await getAlumnoByIdRequest(params.id);
          console.log('Alumno encontrado:', alumno);
          setAlumno(alumno);
        } catch (error) {
          console.error('Error al obtener el alumno:', error);
        }
      }
    };
    fetchAlumno();
  }, [params.id]);

  return (
    <div>
        <h1>{params.id ? 'Editar datos del alumno' : 'Registrar nuevo alumno'}</h1>

        <Formik
            initialValues={alumno}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values)=>{    
                try {
                    if (params.id) {
                        const response = await updateAlumnosRequest(params.id, values);
                        console.log(response);
                        console.log('Alumno actualizado:', values);
                    }else{
                        const response = await createAlumnosRequest(values);
                        console.log('Alumno creado:', response);
                    }
                    setAlumno({
                        nombre: '',
                        rut: '',
                        carrera: '',
                        facultad: '',
                        departamento: ''
                    });
                    navigate('/students'); // Redirigir a la lista de alumnos después de crear o actualizar
                } catch (error) {
                    console.error('Error al crear alumno:', error);
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

                <label htmlFor="rut">Rut</label>
                <input type="text" name="rut"
                onChange={handleChange}
                value={values.rut}
                />

                <label htmlFor="carrera">Carrera</label>
                <input type="text" name="carrera"
                onChange={handleChange}
                value={values.carrera}
                />

                <label htmlFor="facultad">Facultad</label>
                <input type="text" name="facultad"
                onChange={handleChange}
                value={values.facultad}
                />

                <label htmlFor="departamento">Departamento</label>
                <input type="text" name="departamento"
                onChange={handleChange}
                value={values.departamento}
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