export class Panic extends Error {
  readonly #class = Panic
  readonly name = this.#class.name
}

export namespace Panic {

  export function warnOrThrow(e: unknown) {
    if (e instanceof Panic)
      throw e
    console.warn(e)
  }

}