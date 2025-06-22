import express from 'express';
import cors from 'cors';
import alumnosRoutes from './routes/alumnos.routes.js';
import ensayosRoutes from './routes/ensayos.routes.js';
import ingresosRoutes from './routes/ingresos.routes.js'
import actividadesRoutes from './routes/actividades.routes.js'
import asistenciasRoutes from './routes/asistencias.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import { HOST, PORT } from './config/configEnv.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(alumnosRoutes);
app.use(ensayosRoutes);
app.use(ingresosRoutes);
app.use(actividadesRoutes);
app.use(asistenciasRoutes);
app.use(usuariosRoutes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${HOST}:${PORT}`);
});