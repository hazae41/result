export class Err<E = unknown>  {

  constructor(
    readonly inner: E
  ) { }

  static new<E>(inner: E) {
    return new this(inner)
  }

  static error(message: string, options?: ErrorOptions) {
    return new this(new Error(message, options))
  }

  isOk(): false {
    return false
  }

  /**
   * Type guard for Err
   * @returns 
   */
  isErr(): this is Err<E> {
    return true
  }

  unwrap(): never {
    throw this.inner
  }

  map(mapper: unknown) {
    return this
  }

  tryMap(mapper: unknown) {
    return this
  }

  mapSync(mapper: unknown) {
    return this
  }

  tryMapSync(mapper: unknown) {
    return this
  }

}

