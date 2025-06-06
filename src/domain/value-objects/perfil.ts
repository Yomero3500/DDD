export class Perfil {
  private readonly idioma: string;
  private readonly zonaHoraria: string;

  constructor(idioma: string, zonaHoraria: string) {
    this.idioma = idioma;
    this.zonaHoraria = zonaHoraria;
  }

  getIdioma(): string {
    return this.idioma;
  }

  getZonaHoraria(): string {
    return this.zonaHoraria;
  }
}
