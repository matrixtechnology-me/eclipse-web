import bcryptjs from "bcryptjs";

export class HashingService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds;
  }

  /**
   * Cria um hash seguro para senhas
   * @param plainTextPassword Senha em texto puro
   * @returns Promise com o hash gerado
   */
  async hashPassword(plainTextPassword: string): Promise<string> {
    return await bcryptjs.hash(plainTextPassword, this.saltRounds);
  }

  /**
   * Compara uma senha em texto puro com um hash
   * @param plainTextPassword Senha em texto puro
   * @param hashedPassword Hash armazenado
   * @returns Promise<boolean> indicando se correspondem
   */
  async comparePassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcryptjs.compare(plainTextPassword, hashedPassword);
  }

  /**
   * Gera um salt aleatório
   * @returns Salt gerado
   */
  async generateSalt(): Promise<string> {
    return await bcryptjs.genSalt(this.saltRounds);
  }
}
