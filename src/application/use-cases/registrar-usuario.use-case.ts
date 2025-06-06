import { Usuario } from '../../domain/entities/user';
import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { Perfil } from '../../domain/value-objects/perfil';
import { Rol, TipoRol } from '../../domain/value-objects/rol';
import { UserDTO, CreateUserDTO } from '../dtos/user-dto';
import { UserRegisteredEvent } from '../../domain/events/user-events';

export class RegistrarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserDTO> {
    // Validar que el usuario no exista
    const existingUser = await this.usuarioRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear value objects
    const email = new Email(dto.email);
    const password = Password.create(dto.contrasena);
    const perfil = new Perfil(dto.idioma, dto.zonaHoraria);
    const rol = new Rol(TipoRol.ESPECTADOR);

    // Crear usuario
    const usuario = new Usuario(
      Date.now().toString(), // Temporal, en producción usar UUID
      dto.nombre,
      email,
      password,
      perfil,
      rol
    );

    // Persistir
    await this.usuarioRepository.save(usuario);

    // Emitir evento
    const event = new UserRegisteredEvent(
      usuario.getId(),
      usuario.getEmail(),
      usuario.getNombre()
    );
    // TODO: Publicar evento

    // Retornar DTO
    return this.toDTO(usuario);
  }

  private toDTO(usuario: Usuario): UserDTO {
    const rol = usuario.getRol();
    return {
      id: usuario.getId(),
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      rol: rol.getTipo(),
      rolDescripcion: this.getRolDescripcion(rol),
      perfil: {
        idioma: usuario.getPerfil().getIdioma(),
        zonaHoraria: usuario.getPerfil().getZonaHoraria()
      },
      permisos: this.getPermisosPorRol(rol)
    };
  }

  private getRolDescripcion(rol: Rol): string {
    switch (rol.getTipo()) {
      case TipoRol.ESPECTADOR:
        return 'Usuario que puede ver streams y participar en el chat';
      case TipoRol.STREAMER:
        return 'Creador de contenido que puede transmitir en vivo';
      case TipoRol.MODERADOR:
        return 'Usuario con permisos especiales de moderación';
      default:
        return 'Rol no definido';
    }
  }

  private getPermisosPorRol(rol: Rol): string[] {
    const permisos: string[] = ['ver_streams', 'usar_chat'];
    
    if (rol.esStreamer()) {
      permisos.push('crear_stream', 'configurar_canal', 'ver_estadisticas');
    }
    
    if (rol.esModerador()) {
      permisos.push('moderar_chat', 'banear_usuarios', 'eliminar_mensajes');
    }
    
    return permisos;
  }
}
