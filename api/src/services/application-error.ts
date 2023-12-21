export class ApplicationError extends Error {
  statusCode: number;
  error_message: string | string[];

  constructor(message: string | string[], statusCode: number) {
    if (Array.isArray(message)) {
      super(message.join());
    } else {
      super(message);
    }
    this.statusCode = statusCode;
    this.error_message = message;
    // Object.setPrototypeOf(this, ApplicationError.prototype);
  }
  serializeErrors() {
    if (Array.isArray(this.error_message)) {
      return this.error_message.map((val) => {
        return {
          message: val,
        };
      });
    } else {
      return [
        {
          message: this.error_message,
        },
      ];
    }
  }
}
