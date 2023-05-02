import { None, Some } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"

export type OkInner<O> = O extends Ok<infer T> ? T : never

export class Ok<T = unknown>  {

  /**
   * A success
   * @param inner 
   */
  constructor(
    readonly inner: T
  ) { }

  /**
   * Create an empty `Ok`
   * @returns `Ok(void)`
   */
  static void(): Ok<void> {
    return new this<void>(undefined)
  }

  /**
   * Create an `Ok`
   * @param inner 
   * @returns `Ok(inner)`
   */
  static new<T>(inner: T): Ok<T> {
    return new this<T>(inner)
  }

  static wrap<T>(callback: () => T) {
    return new this<T>(callback())
  }

  /**
   * Type guard for `Ok`
   * @returns `true` if `Ok`, `false` if `Err`
   */
  isOk(): this is Ok<T> {
    return true
  }

  /**
   * Type guard for `Err`
   * @returns `true` if `Err`, `false` if `Ok`
   */
  isErr(): false {
    return false
  }

  /**
   * Transform `Result<T, E>` into `Option<T>`
   * @returns `Some(this.inner)` if `Ok`, `None` if `Err`
   */
  ok(): Some<T> {
    return new Some(this.inner)
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err(): None {
    return new None()
  }

  /**
   * Returns an iterator over the possibly contained value
   * @yields `this.inner` if `Ok`
   */
  *[Symbol.iterator](): Iterator<T, void> {
    yield this.inner
  }

  /**
   * Returns true if the result is an `Ok` value containing the given value
   * @param value 
   * @returns `true` if `Ok` and `this.inner === value`, `false` otherwise
   */
  contains(value: T): boolean {
    return this.inner === value
  }

  /**
   * Returns true if the result is an `Err` value containing the given value
   * @param value 
   * @returns `true` if `Err` and `this.inner === value`, `false` otherwise
   */
  containsErr(value: unknown): false {
    return false
  }

  /**
   * Just like `unwrap` but it throws `this` instead of `this.inner`
   * @returns `this.inner` if `Ok`
   * @throws `this` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw(): T {
    return this.inner
  }

  /**
   * Get the inner value or throw the inner error wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
   */
  expect(message: string): T {
    return this.inner
  }

  /**
   * Get the inner error or throw the inner value wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
   */
  expectErr(message: string): never {
    throw new Error(message, { cause: this.inner })
  }

  /**
   * Get the inner value or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  unwrap(): T {
    return this.inner
  }

  /**
   * Throw the inner value or get the inner error
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr(): never {
    throw this.inner
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  unwrapOr(value: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  unwrapOrElse(errMapper: unknown): T {
    return this.inner
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await(): Promise<Ok<Awaited<T>>> {
    return new Ok(await this.inner)
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  inspect(okCallback: (inner: T) => Promise<void>): Promise<this>

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  inspect(okCallback: (inner: T) => void): this

  inspect(okCallback: (inner: T) => Promiseable<void>): Promiseable<this> {
    const promiseable = okCallback(this.inner)

    if (promiseable instanceof Promise)
      return promiseable.then(() => this)

    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  inspectSync(okCallback: (inner: T) => void): this {
    okCallback(this.inner)
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param errCallback 
   * @returns `this`
   */
  inspectErr(errCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param errCallback 
   * @returns `this`
   */
  inspectErrSync(errCallback: unknown): this {
    return this
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  map<U>(okMapper: (inner: T) => Promise<U>): Promise<Ok<U>>

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  map<U>(okMapper: (inner: T) => U): Ok<U>

  map<U>(okMapper: (inner: T) => Promiseable<U>): Promiseable<Ok<U>> {
    const promiseable = okMapper(this.inner)

    if (promiseable instanceof Promise)
      return promiseable.then(x => new Ok<U>(x))

    return new Ok<U>(promiseable)
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapSync<U>(okMapper: (inner: T) => U): Ok<U> {
    return new Ok<U>(okMapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  mapErr(errMapper: unknown): this {
    return this
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  mapErrSync(errMapper: unknown): this {
    return this
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapOr<U>(value: U, okMapper: (inner: T) => U): U {
    return okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
   */
  mapOrElse<U>(errMapper: unknown, okMapper: (inner: T) => U): U {
    return okMapper(this.inner)
  }

  /**
   * Return `value` if `Ok`, return `this` if `Err`
   * @param value 
   * @returns `value` if `Ok`, `this` if `Err`
   */
  and<U>(value: U): U {
    return value
  }

  /**
   * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  andThen<U>(okMapper: (inner: T) => U): U {
    return okMapper(this.inner)
  }

  /**
   * Return `value` if `Err`, return `this` if `Ok`
   * @param value 
   * @returns `value` if `Err`, `this` if `Ok`
   */
  or(value: unknown): this {
    return this
  }

  /**
   * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  orElse(errMapper: unknown): this {
    return this
  }

}