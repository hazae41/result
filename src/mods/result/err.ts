import { None, Some } from "@hazae41/option"
import { Class } from "libs/reflection/reflection.js"

export type ErrInner<E> = E extends Err<infer T> ? T : never

export class Err<T = unknown>  {

  /**
   * A failure
   * @param inner 
   */
  constructor(
    readonly inner: T
  ) { }

  /**
   * Create an empty `Err`
   * @returns `Err(void)`
   */
  static void() {
    return new this<void>(undefined)
  }

  /**
   * Create an `Err`
   * @param inner 
   * @returns `Err(inner)`
   */
  static new<T>(inner: T) {
    return new this(inner)
  }

  /**
   * Create an `Err` with an `Error` inside
   * @param message 
   * @param options 
   * @returns 
   */
  static error(message: string, options?: ErrorOptions) {
    return new this(new Error(message, options))
  }

  /**
   * Try to cast `inner` into one of the `types` and return `Err(inner)`, throw `e` if unable to do so
   * @param inner 
   * @param type 
   * @returns `Err(inner)` if `e` is an `instanceof` one of the `types`
   * @throws `inner` if unable to do so
   */
  static castOrThrow<T>(inner: unknown, ...types: Class<T>[]) {
    for (const type of types)
      if (inner instanceof type)
        return new this(inner)

    throw inner
  }

  /**
   * Try to cast `err` into `Err`, try to cast `err.inner` into one of the `types`, and return `err`, throw `err` if unable to do so
   * @param err 
   * @returns `err` if `err instanceof Err` and `err.inner instanceof type` for some `type` in `types`
   * @throws `err` if unable to do so
   */
  static innerCastOrThrow<T>(err: unknown, ...types: Class<T>[]) {
    if (!(err instanceof Err))
      throw err

    if (!types.length)
      return err as Err<T>

    for (const type of types)
      if (err instanceof Err && err.inner instanceof type)
        return err as Err<T>

    throw err
  }

  /**
   * Type guard for `Ok`
   * @returns `true` if `Ok`, `false` if `Err`
   */
  isOk(): false {
    return false
  }

  /**
   * Type guard for `Err`
   * @returns `true` if `Err`, `false` if `Ok`
   */
  isErr(): this is Err<T> {
    return true
  }

  /**
   * Transform `Result<T, E>` into `Option<T>`
   * @returns `Some(this.inner)` if `Ok`, `None` if `Err`
   */
  ok() {
    return new None()
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err() {
    return new Some(this.inner)
  }

  /**
   * Just like `unwrap` but it throws `this` instead of `this.inner`
   * @returns `this.inner` if `Ok`
   * @throws `this` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw(): never {
    throw this
  }

  /**
   * Get the inner value or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  unwrap(): never {
    throw this.inner
  }

  /**
   * Get the inner value or a default one
   * @param or 
   * @returns `this.inner` if `Ok`, `or` if `Err`
   */
  unwrapOr<O>(or: O) {
    return or
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await() {
    return this
  }

  /**
   * Map the inner value into another, throwing if mapper throws
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  map(mapper: unknown) {
    return this
  }

  /**
   * Map the inner value into another, throwing if mapper throws
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapSync(mapper: unknown) {
    return this
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `or` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async mapOr<M>(or: M, mapper: unknown) {
    return or
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `or` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapOrSync<M>(or: M, mapper: unknown) {
    return or
  }

}