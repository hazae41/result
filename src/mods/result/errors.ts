export class Unimplemented extends Error {
  readonly #class = Unimplemented
  readonly name = this.#class.name
}

export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name

  static from(cause: unknown) {
    return new Panic(undefined, { cause })
  }

}