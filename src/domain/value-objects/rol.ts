export enum TipoRol {
  ESPECTADOR = 'ESPECTADOR',
  STREAMER = 'STREAMER',
  MODERADOR = 'MODERADOR'
}

export class Rol {
  private readonly tipo: TipoRol;

  constructor(tipo: string) {
    if (!Object.values(TipoRol).includes(tipo as TipoRol)) {
      throw new Error('Tipo de rol inválido');
    }
    this.tipo = tipo as TipoRol;
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
