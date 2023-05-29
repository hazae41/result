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

}
