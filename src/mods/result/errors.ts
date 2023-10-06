import { Err } from "./err.js"

export class Unimplemented extends Error {
  readonly #class = Unimplemented
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Something is not implemented`, options)
  }

}

export class AssertError extends Error {
  readonly #class = AssertError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Some assertion failed`, options)
  }

}

export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Something was not expected`, options)
  }

  static from(cause: unknown) {
    return new Panic({ cause })
  }

  static fromAndThrow(cause: unknown): never {
    throw new Panic({ cause })
  }

}

export class Catched extends Error {
  readonly #class = Catched
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Something has been catched`, options)
  }

  static from(cause: unknown) {
    return new Catched({ cause })
  }

  static fromAndThrow(cause: unknown): never {
    throw new Catched({ cause })
  }

  /**
   * Throw if `Catched`, wrap in `Err` otherwise
   * @param error 
   * @returns `Err(error)` if not `Catched` 
   * @throws `error.cause` if `Catched` 
   */
  static throwOrErr(error: unknown) {
    if (error instanceof Catched)
      throw error.cause
    return new Err(error)
  }

}
