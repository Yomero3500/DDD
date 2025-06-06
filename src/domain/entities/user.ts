import { Perfil } from '../value-objects/perfil';
import { Rol } from '../value-objects/rol';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

export class Usuario {
  private id: string;
  private nombre: string;
  private email: Email;
  private password: Password;
  private perfil: Perfil;
  private rol: Rol;

  constructor(
    id: string,
    nombre: string,
    email: Email,
    password: Password,
    perfil: Perfil,
    rol: Rol
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.perfil = perfil;
    this.rol = rol;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getPassword(): string {
    return this.password.getHashedValue();
  }

  getPerfil(): Perfil {
    return this.perfil;
  }

  getRol(): Rol {
    return this.rol;
  }

  // Métodos de dominio
  cambiarRol(nuevoRol: Rol): void {
    const oldRol = this.rol;
    this.rol = nuevoRol;
    // Aquí se emitiría el evento RoleChangedEvent
  }

  actualizarPerfil(nuevoPerfil: Perfil): void {
    this.perfil = nuevoPerfil;
  }

  cambiarPassword(newPassword: Password): void {
    this.password = newPassword;
  }

  actualizarNombre(nuevoNombre: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    this.nombre = nuevoNombre;
  }
}
