import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Password } from '../../domain/value-objects/password';
import { Usuario } from '../../domain/entities/user';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  userId: string;
}

export class LoginUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    const usuario = await this.usuarioRepository.findByEmail(dto.email);
    if (!usuario) {
      throw new Error('Credenciales inválidas, email no encontrado');
    }
    // Comparar la contraseña en texto plano con el hash almacenado
    if (!Password.compare(dto.password, usuario.getPassword())) {
      throw new Error('Credenciales inválidas, contraseña incorrecta');
    }

    const token = this.generateToken(usuario);

    return {
      token,
      userId: usuario.getId()
    };
  }

  private generateToken(usuario: Usuario): string {
    return Buffer.from(`${usuario.getId()}:${Date.now()}`).toString('base64');
  }
}
