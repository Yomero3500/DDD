const ISO_639_1 = /^[a-z]{2}$/i;
const IANA_TZ = /^[A-Za-z_]+\/[A-Za-z_]+$/;

export class Perfil {
  private readonly idioma: string;
  private readonly zonaHoraria: string;

  constructor(idioma: string, zonaHoraria: string) {
    this.validateIdioma(idioma);
    this.validateZonaHoraria(zonaHoraria);
    this.idioma = idioma;
    this.zonaHoraria = zonaHoraria;
  }

  private validateIdioma(idioma: string): void {
    if (!ISO_639_1.test(idioma)) {
      throw new Error('Idioma inválido (debe ser código ISO 639-1, ej: es, en, fr)');
    }
  }

  private validateZonaHoraria(zona: string): void {
    if (!IANA_TZ.test(zona)) {
      throw new Error('Zona horaria inválida (debe ser IANA Time Zone, ej: America/Mexico_City)');
    }
  }

  getIdioma(): string {
    return this.idioma;
  }

  getZonaHoraria(): string {
    return this.zonaHoraria;
  }
}
