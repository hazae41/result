import { None, Some } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"
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
  static void(): Err<void> {
    return new this<void>(undefined)
  }

  /**
   * Create an `Err`
   * @param inner 
   * @returns `Err(inner)`
   */
  static new<T>(inner: T): Err<T> {
    return new this(inner)
  }

  /**
   * Create an `Err` with an `Error` inside
   * @param message 
   * @param options 
   * @returns `Err<Error>`
   */
  static error(message: string, options?: ErrorOptions): Err<Error> {
    return new this(new Error(message, options))
  }

  /**
   * Try to cast `inner` into one of the `types` and return `Err(inner)`, throw `inner` if unable to do so
   * @param inner 
   * @param types
   * @returns `Err(inner)` if `e` is an `instanceof` one of the `types`
   * @throws `inner` if unable to do so
   */
  static castAndWrapOrThrow<T>(inner: unknown, ...types: Class<T>[]): Err<T> {
    if (!types.length)
      return new this(inner) as Err<T>

    for (const type of types)
      if (inner instanceof type)
        return new this(inner) as Err<T>

    throw inner
  }

  /**
   * Try to cast `err` into `Err`, try to cast `err.inner` into one of the `types`, and return `err`, throw `err` if unable to do so
   * @param err 
   * @param types
   * @returns `err` if `err instanceof Err` and `err.inner instanceof type` for some `type` in `types`
   * @throws `err` if unable to do so
   */
  static castOrThrow<T>(err: unknown, ...types: Class<T>[]): Err<T> {
    if (!(err instanceof Err))
      throw err

    if (!types.length)
      return err as Err<T>

    for (const type of types)
      if (err.inner instanceof type)
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
  ok(): None {
    return new None()
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err(): Some<T> {
    return new Some(this.inner)
  }

  /**
   * Returns an iterator over the possibly contained value
   * @yields `this.inner` if `Ok`
   */
  *[Symbol.iterator](): Iterator<never, void> {
    return
  }

  /**
   * Returns true if the result is an `Ok` value containing the given value
   * @param value 
   * @returns `true` if `Ok` and `this.inner === value`, `false` otherwise
   */
  contains(value: unknown): false {
    return false
  }

  /**
   * Returns true if the result is an `Err` value containing the given value
   * @param value 
   * @returns `true` if `Err` and `this.inner === value`, `false` otherwise
   */
  containsErr(value: T): boolean {
    return this.inner === value
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
   * Get the inner value or throw the inner error wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
   */
  expect(message: string): never {
    throw new Error(message, { cause: this.inner })
  }

  /**
   * Get the inner error or throw the inner value wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
   */
  expectErr(message: string): T {
    return this.inner
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
   * Throw the inner value or get the inner error
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr(): T {
    return this.inner
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  unwrapOr<U>(value: U): U {
    return value
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await errMapper(this.inner)` throws
   */
  async unwrapOrElse<U>(errMapper: (inner: T) => Promiseable<U>): Promise<U> {
    return await errMapper(this.inner)
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  unwrapOrElseSync<U>(errMapper: (inner: T) => U): U {
    return errMapper(this.inner)
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await(): Promise<this> {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  inspect(okCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  inspectSync(okCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param errCallback 
   * @returns `this`
   */
  async inspectErr(errCallback: (inner: T) => Promiseable<void>): Promise<this> {
    await errCallback(this.inner)
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param errCallback 
   * @returns `this`
   */
  inspectErrSync(errCallback: (inner: T) => void): this {
    errCallback(this.inner)
    return this
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  map(okMapper: unknown): this {
    return this
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapSync(okMapper: unknown): this {
    return this
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async mapErr<U>(errMapper: (inner: T) => Promiseable<U>): Promise<Err<U>> {
    return new Err<U>(await errMapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  mapErrSync<U>(errMapper: (inner: T) => U): Err<U> {
    return new Err<U>(errMapper(this.inner))
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  mapOr<U>(value: U, okMapper: unknown): U {
    return value
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapOrSync<U>(value: U, okMapper: unknown): U {
    return value
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
   */
  async mapOrElse<U>(errMapper: (inner: T) => Promiseable<U>, okMapper: unknown): Promise<U> {
    return await errMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
   */
  mapOrElseSync<U>(errMapper: (inner: T) => U, okMapper: unknown): U {
    return errMapper(this.inner)
  }

  /**
   * Return `value` if `Ok`, return `this` if `Err`
   * @param value 
   * @returns `value` if `Ok`, `this` if `Err`
   */
  and(value: unknown): this {
    return this
  }

  /**
   * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  andThen(okMapper: unknown): this {
    return this
  }

  /**
   * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  andThenSync(okMapper: unknown): this {
    return this
  }

  /**
   * Return `value` if `Err`, return `this` if `Ok`
   * @param value 
   * @returns `value` if `Err`, `this` if `Ok`
   */
  or<U>(value: U): U {
    return value
  }

  /**
   * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async orElse<U>(errMapper: (inner: T) => Promiseable<U>): Promise<U> {
    return await errMapper(this.inner)
  }

  /**
   * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  orElseSync<U>(errMapper: (inner: T) => U): U {
    return errMapper(this.inner)
  }

}