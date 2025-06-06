export enum TipoRol {
  ESPECTADOR = 'ESPECTADOR',
  STREAMER = 'STREAMER',
  MODERADOR = 'MODERADOR'
}

export class Rol {
  private readonly tipo: TipoRol;

  constructor(tipo: TipoRol) {
    this.tipo = tipo;
  }

  getTipo(): TipoRol {
    return this.tipo;
  }

  esStreamer(): boolean {
    return this.tipo === TipoRol.STREAMER;
  }

  esModerador(): boolean {
    return this.tipo === TipoRol.MODERADOR;
  }

  esEspectador(): boolean {
    return this.tipo === TipoRol.ESPECTADOR;
  }
}
