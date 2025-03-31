import { ApplicationError } from "./application";

export class InvalidEmailError extends ApplicationError {
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(
    message: string = "Por favor, insira um e-mail válido no formato exemplo@dominio.com",
    details?: {
      attemptedValue?: string;
      requirements?: string[];
      field?: string;
    }
  ) {
    super(message, {
      title: "E-mail inválido",
      statusCode: 400,
      details,
    });

    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }

  static validate(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static fromEmail(email: string): InvalidEmailError {
    return new InvalidEmailError(
      `O e-mail "${email}" não está no formato válido`,
      {
        attemptedValue: email,
        requirements: [
          "Deve conter um @",
          "Deve ter um domínio válido",
          "Não pode conter espaços",
        ],
      }
    );
  }
}
