import { None, Some } from "@hazae41/option"

export class Err<T = unknown>  {

  constructor(
    readonly inner: T
  ) { }

  static new<T>(inner: T) {
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
  isErr(): this is Err<T> {
    return true
  }

  unwrap(): never {
    throw this.inner
  }

  unwrapOr<O>(or: O) {
    return or
  }

  ok() {
    return new None()
  }

  err() {
    return new Some(this.inner)
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