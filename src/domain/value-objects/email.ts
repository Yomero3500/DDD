export class Email {
  private readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    this.validateEmail(normalized);
    this.value = normalized;
  }

  private validateEmail(email: string): void {
    // RFC 5322 Official Standard
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
