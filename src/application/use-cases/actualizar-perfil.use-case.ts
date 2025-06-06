import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Perfil } from '../../domain/value-objects/perfil';

export interface ActualizarPerfilDTO {
  userId: string;
  idioma?: string;
  zonaHoraria?: string;
  nombre?: string;
}

export class ActualizarPerfilUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(dto: ActualizarPerfilDTO): Promise<void> {
    const usuario = await this.usuarioRepository.findById(dto.userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (dto.nombre) {
      usuario.actualizarNombre(dto.nombre);
    }

    if (dto.idioma || dto.zonaHoraria) {
      const perfilActual = usuario.getPerfil();
      const nuevoPerfil = new Perfil(
        dto.idioma || perfilActual.getIdioma(),
        dto.zonaHoraria || perfilActual.getZonaHoraria()
      );
      usuario.actualizarPerfil(nuevoPerfil);
    }

    await this.usuarioRepository.update(usuario);
  }
}
