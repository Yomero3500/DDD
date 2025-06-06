import bcrypt from 'bcryptjs';

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static create(plainPassword: string): Password {
    this.validatePassword(plainPassword);
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    return new Password(hashedPassword);
  }

  static fromHash(hashed: string): Password {
    return new Password(hashed);
  }

  static compare(plain: string, hashed: string): boolean {
    return bcrypt.compareSync(plain, hashed);
  }

  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una minúscula');
    }
    if (!/\d/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      throw new Error('La contraseña debe contener al menos un carácter especial');
    }
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  equals(other: Password): boolean {
    return this.hashedValue === other.hashedValue;
  }
}
