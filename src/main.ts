import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { MongoUsuarioRepository } from './infrastructure/persistence/mongo-usuario-repository';
import { UsuarioService } from './application/services/usuario-service';
import { UsuarioController } from './infrastructure/http/usuario-controller';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twitch-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Dependencies
const usuarioRepository = new MongoUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

// Routes
app.post('/usuarios', (req, res) => usuarioController.registrarUsuario(req, res));
app.get('/usuarios/:id', (req, res) => usuarioController.obtenerUsuario(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
