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
      throw new Error('Credenciales inválidas');
    }

    const password = Password.create(dto.password);
    if (!this.comparePasswords(password, usuario)) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token (implementación básica)
    const token = this.generateToken(usuario);

    return {
      token,
      userId: usuario.getId()
    };
  }

  private comparePasswords(inputPassword: Password, usuario: Usuario): boolean {
    // En una implementación real, aquí se compararían los hashes
    return inputPassword.getHashedValue() === usuario.getPassword();
  }

  private generateToken(usuario: Usuario): string {
    // En una implementación real, usar JWT u otro sistema de tokens
    return Buffer.from(`${usuario.getId()}:${Date.now()}`).toString('base64');
  }
}
