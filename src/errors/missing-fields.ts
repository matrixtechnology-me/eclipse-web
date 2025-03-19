export class MissingFieldsError extends Error {
  constructor() {
    super('Required fields are missing');
    this.name = 'MissingFieldsError';
  }
}
