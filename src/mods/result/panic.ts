export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Panic(undefined, { cause })
  }

}
