export class ValidationError extends Error {
  constructor(public readonly error: string) {
    super("Validation Error");
    this.name = "ValidationError";

    // This line is necessary for proper inheritance in TypeScript
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
