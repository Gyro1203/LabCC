import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import alumnosRoutes from './routes/alumnos.routes.js';
import ensayosRoutes from './routes/ensayos.routes.js';
import ingresosRoutes from './routes/ingresos.routes.js'
import actividadesRoutes from './routes/actividades.routes.js'
import asistenciasRoutes from './routes/asistencias.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js'
import { cookieKey, HOST, PORT } from './config/configEnv.js';
import session from 'express-session';
import passport from 'passport';
import { passportJwtSetUp } from './auth/passport.auth.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "strict",
    },
}),
);
app.use(passport.initialize());
app.use(passport.session());
passportJwtSetUp();
app.use(alumnosRoutes);
app.use(ensayosRoutes);
app.use(ingresosRoutes);
app.use(actividadesRoutes);
app.use(asistenciasRoutes);
app.use(usuariosRoutes);
app.use(authRoutes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${HOST}:${PORT}`);
});