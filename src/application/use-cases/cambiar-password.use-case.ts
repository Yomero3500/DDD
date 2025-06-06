import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Password } from '../../domain/value-objects/password';

export interface CambiarPasswordDTO {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export class CambiarPasswordUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(dto: CambiarPasswordDTO): Promise<void> {
    const usuario = await this.usuarioRepository.findById(dto.userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const oldPassword = Password.create(dto.oldPassword);
    if (oldPassword.getHashedValue() !== usuario.getPassword()) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Crear y validar nueva contraseña
    const newPassword = Password.create(dto.newPassword);
    
    // Actualizar contraseña
    usuario.cambiarPassword(newPassword);
    
    await this.usuarioRepository.update(usuario);
  }
}
