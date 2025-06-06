import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { container } from './container';
import { UsuarioController } from './infrastructure/http/usuario-controller';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twitch-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const usuarioService = container.usuarioService;
const usuarioController = new UsuarioController(usuarioService);

// Routes
app.post('/usuarios', (req, res) => usuarioController.registrarUsuario(req, res));
app.post('/usuarios/login', (req, res) => usuarioController.login(req, res));
app.get('/usuarios/:id', (req, res) => usuarioController.obtenerUsuario(req, res));
app.put('/usuarios/:id/perfil', (req, res) => usuarioController.actualizarPerfil(req, res));
app.put('/usuarios/:id/password', (req, res) => usuarioController.cambiarPassword(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
