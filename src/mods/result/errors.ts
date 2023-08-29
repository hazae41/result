import { Err } from "./err.js"

export class Unimplemented extends Error {
  readonly #class = Unimplemented
  readonly name = this.#class.name
}

export class AssertError extends Error {
  readonly #class = AssertError
  readonly name = this.#class.name

  constructor() {
    super(`Assertion failed`)
  }
}

export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Panic(undefined, { cause })
  }

  static fromAndThrow(cause: unknown): never {
    throw Panic.from(cause)
  }

}

export class Catched extends Error {
  readonly #class = Catched
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Catched(undefined, { cause })
  }

  static fromAndThrow(cause: unknown): never {
    throw Catched.from(cause)
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
