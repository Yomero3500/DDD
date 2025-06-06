import { Usuario } from '../../domain/entities/user';
import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { CreateUserDTO, UserDTO, UpdatePerfilDTO } from '../dtos/user-dto';
import { RegistrarUsuarioUseCase } from '../use-cases/registrar-usuario.use-case';
import { LoginUsuarioUseCase, LoginDTO, LoginResponseDTO } from '../use-cases/login-usuario.use-case';
import { ActualizarPerfilUseCase } from '../use-cases/actualizar-perfil.use-case';
import { CambiarPasswordUseCase, CambiarPasswordDTO } from '../use-cases/cambiar-password.use-case';
import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { Perfil } from '../../domain/value-objects/perfil';
import { Rol, TipoRol } from '../../domain/value-objects/rol';

export class UsuarioService {
  private registrarUsuarioUseCase: RegistrarUsuarioUseCase;
  private loginUsuarioUseCase: LoginUsuarioUseCase;
  private actualizarPerfilUseCase: ActualizarPerfilUseCase;
  private cambiarPasswordUseCase: CambiarPasswordUseCase;

  constructor(private usuarioRepository: IUsuarioRepository) {
    this.registrarUsuarioUseCase = new RegistrarUsuarioUseCase(usuarioRepository);
    this.loginUsuarioUseCase = new LoginUsuarioUseCase(usuarioRepository);
    this.actualizarPerfilUseCase = new ActualizarPerfilUseCase(usuarioRepository);
    this.cambiarPasswordUseCase = new CambiarPasswordUseCase(usuarioRepository);
  }

  async registrarUsuario(dto: CreateUserDTO): Promise<UserDTO> {
    return this.registrarUsuarioUseCase.execute(dto);
  }

  async login(dto: LoginDTO): Promise<LoginResponseDTO> {
    return this.loginUsuarioUseCase.execute(dto);
  }

  async actualizarPerfil(userId: string, dto: UpdatePerfilDTO): Promise<void> {
    await this.actualizarPerfilUseCase.execute({ userId, ...dto });
  }

  async cambiarPassword(dto: CambiarPasswordDTO): Promise<void> {
    await this.cambiarPasswordUseCase.execute(dto);
  }

  async obtenerUsuarioPorId(id: string): Promise<UserDTO | null> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      return null;
    }
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
