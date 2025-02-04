export class ServiceError extends Error {
  description: string;

  status: string;

  constructor(message, description, status) {
    super(message);
    this.description = description;
    this.status = status;
  }

  toString() {
    return `${this.status} ${this.message}: ${this.description}`;
  }
}
