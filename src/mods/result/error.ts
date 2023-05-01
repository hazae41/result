/**
 * Custom Error to only use inside Result kingdom, allowing regular Errors to pass through Err.cast and panicking
 */
export class ResultError extends globalThis.Error {

  /**
   * Custom Error to only use inside Result kingdom, allowing regular Errors to pass through Err.cast and panicking
   */
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
  }

}