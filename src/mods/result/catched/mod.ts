/**
 * An non-error that was caught by a catch clause
 */
export class Catched extends Error {
  readonly #class = Catched

  override readonly name = this.#class.name

  static wrap(cause: unknown) {
    if (cause instanceof Error)
      return cause
    return new Catched(undefined, { cause })
  }

}
