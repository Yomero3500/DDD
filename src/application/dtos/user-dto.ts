export interface CreateUserDTO {
  nombre: string;
  email: string;
  contrasena: string;
  idioma: string;
  zonaHoraria: string;
}

export interface UserDTO {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  rolDescripcion: string;
  perfil: {
    idioma: string;
    zonaHoraria: string;
  };
  permisos: string[];
}

export interface UpdatePerfilDTO {
  nombre?: string;
  idioma?: string;
  zonaHoraria?: string;
}
