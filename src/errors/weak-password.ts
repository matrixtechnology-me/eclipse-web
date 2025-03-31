import { ApplicationError } from "./application";

export class WeakPasswordError extends ApplicationError {
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(
    message: string = "A senha não atende aos requisitos mínimos de segurança",
    details?: {
      attemptedValue?: string;
      requirements?: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
      };
      strengthScore?: number;
    }
  ) {
    super(message, {
      title: "Senha fraca",
      statusCode: 400,
      details: details || {
        requirements: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        },
      },
    });

    Object.setPrototypeOf(this, WeakPasswordError.prototype);
  }

  static validate(
    password: string,
    options?: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    }
  ): boolean {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options || {};

    if (password.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;
    if (requireNumbers && !/[0-9]/.test(password)) return false;
    if (requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) return false;

    return true;
  }

  static fromPassword(
    password: string,
    options?: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    }
  ): WeakPasswordError {
    const requirements = {
      minLength: options?.minLength ?? 8,
      requireUppercase: options?.requireUppercase ?? true,
      requireLowercase: options?.requireLowercase ?? true,
      requireNumbers: options?.requireNumbers ?? true,
      requireSpecialChars: options?.requireSpecialChars ?? true,
    };

    const missingRequirements = [];
    if (password.length < requirements.minLength) {
      missingRequirements.push(`mínimo ${requirements.minLength} caracteres`);
    }
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      missingRequirements.push("letras maiúsculas");
    }
    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      missingRequirements.push("letras minúsculas");
    }
    if (requirements.requireNumbers && !/[0-9]/.test(password)) {
      missingRequirements.push("números");
    }
    if (requirements.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
      missingRequirements.push("caracteres especiais");
    }

    const message = `A senha deve conter: ${missingRequirements.join(", ")}`;

    return new WeakPasswordError(message, {
      attemptedValue: password,
      requirements,
      strengthScore: this.calculateStrength(password),
    });
  }

  private static calculateStrength(password: string): number {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }
}
