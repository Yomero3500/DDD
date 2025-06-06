import { Usuario } from '../../domain/entities/user';
import { Perfil } from '../../domain/value-objects/perfil';
import { Rol, TipoRol } from '../../domain/value-objects/rol';
import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { CreateUserDTO, UserDTO } from '../dtos/user-dto';
import { UserRegisteredEvent } from '../../domain/events/user-events';

export class UsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async registrarUsuario(createUserDTO: CreateUserDTO): Promise<UserDTO> {
    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findByEmail(createUserDTO.email);
    if (usuarioExistente) {
      throw new Error('El usuario ya existe');
    }

    // Crear objetos de valor
    const perfil = new Perfil(createUserDTO.idioma, createUserDTO.zonaHoraria);
    const rol = new Rol(TipoRol.ESPECTADOR); // Por defecto, todos los usuarios son espectadores

    // Crear entidad de usuario
    const usuario = new Usuario(
      Math.random().toString(36).substring(2, 9), // Generar ID simple para el ejemplo
      createUserDTO.nombre,
      createUserDTO.email,
      createUserDTO.contrasena,
      perfil,
      rol
    );

    // Persistir el usuario
    await this.usuarioRepository.save(usuario);

    // Emitir evento de registro
    const event = new UserRegisteredEvent(
      usuario.getId(),
      usuario.getEmail(),
      usuario.getNombre()
    );
    // Aquí se emitiría el evento (necesitaríamos un event bus)

    // Retornar DTO
    return this.toDTO(usuario);
  }

  async obtenerUsuarioPorId(id: string): Promise<UserDTO | null> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      return null;
    }
    return this.toDTO(usuario);
  }

  private toDTO(usuario: Usuario): UserDTO {
    return {
      id: usuario.getId(),
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      rol: usuario.getRol().getTipo(),
      perfil: {
        idioma: usuario.getPerfil().getIdioma(),
        zonaHoraria: usuario.getPerfil().getZonaHoraria()
      }
    };
  }
}
