export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name
}

export class Catched extends Error {
  readonly #class = Catched
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Catched(undefined, { cause })
  }

  static wrap(cause: unknown) {
    if (cause instanceof Error)
      return cause
    return new Catched(undefined, { cause })
  }

}
