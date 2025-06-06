import { Perfil } from '../value-objects/perfil';
import { Rol } from '../value-objects/rol';

export class Usuario {
  private id: string;
  private nombre: string;
  private email: string;
  private contrasena: string;
  private perfil: Perfil;
  private rol: Rol;

  constructor(id: string, nombre: string, email: string, contrasena: string, perfil: Perfil, rol: Rol) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.contrasena = contrasena;
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
    return this.email;
  }

  getContrasena(): string {
    return this.contrasena;
  }

  getPerfil(): Perfil {
    return this.perfil;
  }

  getRol(): Rol {
    return this.rol;
  }

  // Métodos de dominio
  cambiarRol(nuevoRol: Rol): void {
    this.rol = nuevoRol;
    // Aquí se podría emitir un evento de dominio RoleChangedEvent
  }

  actualizarPerfil(nuevoPerfil: Perfil): void {
    this.perfil = nuevoPerfil;
  }
}
