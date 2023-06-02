import { None, Some } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"
import { Class } from "libs/reflection/reflection.js"
import { Debug } from "mods/debug/debug.js"
import { Panic } from "./errors.js"

export namespace Err {

  export type Infer<T> = Err<Inner<T>>

  export type Inner<T> = T extends Err<infer Inner> ? Inner : never

}

export class Err<T = unknown>  {

  #timeout?: NodeJS.Timeout

  /**
   * A failure
   * @param inner 
   */
  constructor(
    readonly inner: T
  ) {
    if (!Debug.debug) return

    const error = new Panic(`Unhandled result`, { cause: this })
    this.#timeout = setTimeout(async () => { throw error }, 1000)
  }

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
   * Set this result as handled
   */
  ignore(): this {
    if (!this.#timeout)
      return this

    clearTimeout(this.#timeout)
    this.#timeout = undefined

    return this
  }

  /**
   * Type guard for `Ok`
   * @returns `true` if `Ok`, `false` if `Err`
   */
  isOk(): false {
    return false
  }

  /**
   * Returns true if the result is `Ok` and the value inside of it matches a predicate
   * @param okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  async isOkAnd(okPredicate: unknown): Promise<false> {
    return false
  }

  /**
   * Returns true if the result is `Ok` and the value inside of it matches a predicate
   * @param okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  isOkAndSync(okPredicate: unknown): false {
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
   * Returns true if the result is `Err` and the value inside of it matches a predicate
   * @param errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  async isErrAnd(errPredicate: (inner: T) => Promiseable<boolean>): Promise<boolean> {
    return await errPredicate(this.inner)
  }

  /**
   * Returns true if the result is `Err` and the value inside of it matches a predicate
   * @param errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  isErrAndSync(errPredicate: (inner: T) => boolean): boolean {
    return errPredicate(this.inner)
  }

  /**
   * Compile-time safely get `this.inner`
   * @returns `this.inner`
   */
  get() {
    this.ignore()

    return this.inner
  }

  /**
   * Transform `Result<T, E>` into `Option<T>`
   * @returns `Some(this.inner)` if `Ok`, `None` if `Err`
   */
  ok(): None {
    this.ignore()

    return new None()
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err(): Some<T> {
    this.ignore()

    return new Some(this.inner)
  }

  /**
   * Returns an iterator over the possibly contained value
   * @yields `this.inner` if `Ok`
   */
  *[Symbol.iterator](): Iterator<never, void> {
    this.ignore()

    return
  }

  /**
   * Transform `Result<T,E>` into `[T,E]`
   * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
   */
  split(): [undefined, T] {
    this.ignore()

    return [undefined, this.inner]
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
   * Get the inner value or throw to the closest `Result.unthrow`
   * @param thrower The thrower from `Result.unthrow`
   * @returns `this.inner` if `Ok`
   * @throws `undefined` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw(thrower: (e: Err<T>) => void): never {
    thrower(this)

    throw new Panic(`Thrown result was try-catched`)
  }

  /**
   * Get the inner value or throw the inner error wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
   */
  expect(message: string): never {
    this.ignore()

    throw new Panic(message, { cause: this.inner })
  }

  /**
   * Get the inner error or throw the inner value wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
   */
  expectErr(message: string): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner value or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  unwrap(): never {
    this.ignore()

    throw new Panic(undefined, { cause: this.inner })
  }

  /**
   * Throw the inner value or get the inner error
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr(): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  unwrapOr<U>(value: U): U {
    this.ignore()

    return value
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await errMapper(this.inner)` throws
   */
  async unwrapOrElse<U>(errMapper: (inner: T) => Promiseable<U>): Promise<U> {
    this.ignore()

    return await errMapper(this.inner)
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  unwrapOrElseSync<U>(errMapper: (inner: T) => U): U {
    this.ignore()

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
   * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Err`, `this` if `Ok`
   */
  async awaitErr(): Promise<Err<Awaited<T>>> {
    return new Err(await this.inner)
  }

  /**
   * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner`
   */
  async awaitAll(): Promise<Err<Awaited<T>>> {
    return await this.awaitErr()
  }

  /**
   * Transform `Result<T, E>` into `Result<void, E>`
   * @returns `Ok<void>` if `Ok<T>`, `Err<E>` if `E<E>`
   */
  clear(): this {
    return this
  }

  /**
   * Transform `Result<T, E>` into `Result<T, void>`
   * @returns `Ok<T>` if `Ok<T>`, `Err<void>` if `E<E>`
   */
  clearErr(): Err<void> {
    this.ignore()

    return Err.void()
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  async inspect(okCallback: unknown): Promise<this> {
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
   * Return a new `Ok` but with the given `inner`
   * @param inner 
   * @returns `Ok(inner)` if `Ok`, `this` if `Err`
   */
  set(inner: unknown): this {
    return this
  }

  /**
   * Return a new `Err` but with the given `inner`
   * @param inner 
   * @returns `Err(inner)` if `Err`, `this` if `Ok`
   */
  setErr<U>(inner: U): Err<U> {
    return new Err(inner)
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async map(okMapper: unknown): Promise<this> {
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
    this.ignore()

    return new Err<U>(await errMapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  mapErrSync<U>(errMapper: (inner: T) => U): Err<U> {
    this.ignore()

    return new Err<U>(errMapper(this.inner))
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async mapOr<U>(value: U, okMapper: unknown): Promise<U> {
    this.ignore()

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
    this.ignore()

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
    this.ignore()

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
    this.ignore()

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
  async andThen(okMapper: unknown): Promise<this> {
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
    this.ignore()

    return value
  }

  /**
   * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async orElse<U>(errMapper: (inner: T) => Promiseable<U>): Promise<U> {
    this.ignore()

    return await errMapper(this.inner)
  }

  /**
   * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  orElseSync<U>(errMapper: (inner: T) => U): U {
    this.ignore()

    return errMapper(this.inner)
  }

}