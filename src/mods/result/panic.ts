export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Panic(undefined, { cause })
  }

}

export namespace Panic {

  /**
   * Throw `error` if `Panic`, return `error` otherwise
   * @param error 
   * @returns error if not `Panic`
   * @throws error if `Panic`
   */
  export function rethrow<T>(error: T): Exclude<T, Panic> {
    if (error instanceof Panic)
      throw error
    return error as Exclude<T, Panic>
  }

  /**
   * Convert error to `Panic` if not already
   * @param error 
   * @returns `error` if `Panic`, `Panic.from(error)` otherwise
   */
  export function castOrFrom(error: unknown) {
    if (error instanceof Panic)
      return error
    return Panic.from(error)
  }

}