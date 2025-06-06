export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static create(plainPassword: string): Password {
    this.validatePassword(plainPassword);
    // En una implementación real, aquí se haría el hash de la contraseña
    const hashedPassword = plainPassword; // TODO: Implementar hash real
    return new Password(hashedPassword);
  }

  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/\d/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }
}
