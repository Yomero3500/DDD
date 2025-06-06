import { MongoUsuarioRepository } from './infrastructure/persistence/mongo-usuario-repository';
import { UsuarioService } from './application/services/usuario-service';

const usuarioRepository = new MongoUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

export const container = {
  usuarioRepository,
  usuarioService,
};
