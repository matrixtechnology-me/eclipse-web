import crypto from "crypto";

interface EncryptionResult {
  iv: string;
  content: string;
}

export class CryptoService {
  private readonly algorithm = "aes-256-cbc";
  private readonly key: Buffer;

  constructor() {
    this.key = crypto.scryptSync(
      process.env.ENCRYPTION_SECRET ?? "default-secret-32-bytes-long-123456",
      "salt",
      32
    );
  }

  /**
   * Criptografa um texto usando AES-256-CBC
   * @param text Texto a ser criptografado
   * @returns Objeto com IV e conteúdo criptografado em base64
   */
  encrypt(text: string): EncryptionResult {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      iv: iv.toString("hex"),
      content: encrypted,
    };
  }

  /**
   * Descriptografa um texto previamente criptografado
   * @param encrypted Objeto com IV e conteúdo criptografado
   * @returns Texto descriptografado
   */
  decrypt(encrypted: EncryptionResult): string {
    const iv = Buffer.from(encrypted.iv, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    let decrypted = decipher.update(encrypted.content, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  /**
   * Gera um hash seguro (para senhas, não reversível)
   * @param data Dados a serem hasheados
   * @returns Hash em hexadecimal
   */
  hash(data: string): string {
    return crypto
      .createHash("sha256")
      .update(data + this.key.toString("hex"))
      .digest("hex");
  }
}
