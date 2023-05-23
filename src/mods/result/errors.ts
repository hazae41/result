export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name
}

export namespace Panic {

  export function unthrow(e: unknown) {
    if (e instanceof Panic)
      throw e
    return e
  }

}