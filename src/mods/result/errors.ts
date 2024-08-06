/**
 * An error that should have been prevented by the type system
 */
export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name
}

/**
 * An non-error that was caught by a catch clause
 */
export class Catched extends Error {
  readonly #class = Catched
  readonly name = this.#class.name

  static wrap(cause: unknown) {
    if (cause instanceof Error)
      return cause
    return new Catched(undefined, { cause })
  }

}
