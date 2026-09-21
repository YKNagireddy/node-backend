// Error that carries an HTTP status code so controllers can respond correctly
// without leaking internal error messages.
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
