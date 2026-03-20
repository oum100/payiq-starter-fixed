export class NonRetryableJobError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "NonRetryableJobError";
    this.code = code;
  }
}