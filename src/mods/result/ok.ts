import { None, Some } from "@hazae41/option"
import { Awaitable } from "libs/promises/promises.js"
import { Panic } from "./errors.js"
import { Result } from "./result.js"

export namespace Ok {

  export type Infer<T> = Ok<Inner<T>>

  export type Inner<T> = T extends Ok<infer Inner> ? Inner : never

}

export class Ok<T = unknown>  {

  #inner: T

  #timeout?: NodeJS.Timeout

  /**
   * A success
   * @param inner 
   */
  constructor(inner: T) {
    this.#inner = inner

    if (!Result.debug) return

    const error = new Panic(`Unhandled`, { cause: this })
    this.#timeout = setTimeout(() => { throw error }, 1000)
  }

  /**
   * Create an empty `Ok`
   * @returns `Ok(void)`
   */
  static void(): Ok<void> {
    return new Ok<void>(undefined)
  }

  /**
   * Create an `Ok`
   * @param inner 
   * @returns `Ok(inner)`
   */
  static new<T>(inner: T): Ok<T> {
    return new Ok<T>(inner)
  }

  get inner() {
    return this.#inner
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
  isOk(): this is Ok<T> {
    return true
  }

  /**
   * Returns true if the result is `Ok` and the value inside of it matches a predicate
   * @param okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  async isOkAnd(okPredicate: (inner: T) => Awaitable<boolean>): Promise<boolean> {
    return await okPredicate(this.inner)
  }

  /**
   * Returns true if the result is `Ok` and the value inside of it matches a predicate
   * @param okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  isOkAndSync(okPredicate: (inner: T) => boolean): boolean {
    return okPredicate(this.inner)
  }

  /**
   * Type guard for `Err`
   * @returns `true` if `Err`, `false` if `Ok`
   */
  isErr(): false {
    return false
  }

  /**
   * Returns true if the result is `Err` and the value inside of it matches a predicate
   * @param errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  async isErrAnd(errPredicate: unknown): Promise<false> {
    return false
  }

  /**
   * Returns true if the result is `Err` and the value inside of it matches a predicate
   * @param errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  isErrAndSync(errPredicate: unknown): false {
    return false
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
  ok(): Some<T> {
    this.ignore()

    return new Some(this.inner)
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err(): None {
    this.ignore()

    return new None()
  }

  /**
   * Returns an iterator over the possibly contained value
   * @yields `this.inner` if `Ok`
   */
  *[Symbol.iterator](): Iterator<T, void> {
    this.ignore()

    yield this.inner
  }

  /**
   * Transform `Result<T,E>` into `[T,E]`
   * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
   */
  split(): [T, undefined] {
    this.ignore()

    return [this.inner, undefined]
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
   * Just like `unwrap` but it throws to the closest `Result.unthrow`
   * @returns `this.inner` if `Ok`
   * @throws `this` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw(thrower: unknown): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner value or throw the inner error wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Ok`, `Error(message, { cause: this.inner })` if `Err`
   */
  expect(message: string): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner error or throw the inner value wrapped inside another Error
   * @param message 
   * @returns `this.inner` if `Err`, `Error(message, { cause: this.inner })` if `Ok`
   */
  expectErr(message: string): never {
    this.ignore()

    throw new Panic(message, { cause: this })
  }

  /**
   * Get the inner value or panic
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  unwrap(): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner error or panic
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr(): never {
    this.ignore()

    throw new Panic(`Unwrapped`, { cause: this })
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  unwrapOr(value: unknown): T {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await errMapper(this.inner)` throws
   */
  async unwrapOrElse(errMapper: unknown): Promise<T> {
    this.ignore()

    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  unwrapOrElseSync(errMapper: unknown): T {
    this.ignore()

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
   * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Err`, `this` if `Ok`
   */
  async awaitErr(): Promise<this> {
    return this
  }

  /**
   * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner`
   */
  async awaitAll(): Promise<Ok<Awaited<T>>> {
    return await this.await()
  }

  /**
   * Transform `Result<T, E>` into `Result<void, E>`
   * @returns `Ok<void>` if `Ok<T>`, `Err<E>` if `E<E>`
   */
  clear(): Ok<void> {
    this.ignore()

    return Ok.void()
  }

  /**
   * Transform `Result<T, E>` into `Result<T, void>`
   * @returns `Ok<T>` if `Ok<T>`, `Err<void>` if `E<E>`
   */
  clearErr(): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param okCallback 
   * @returns `this`
   */
  async inspect(okCallback: (inner: T) => Awaitable<void>): Promise<this> {
    await okCallback(this.inner)
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
  async inspectErr(errCallback: unknown): Promise<this> {
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
   * Return a new `Ok` but with the given `inner`
   * @param inner 
   * @returns `Ok(inner)` if `Ok`, `this` if `Err`
   */
  set<U>(inner: U): Ok<U> {
    return new Ok(inner)
  }

  /**
   * Return a new `Err` but with the given `inner`
   * @param inner 
   * @returns `Err(inner)` if `Err`, `this` if `Ok`
   */
  setErr(inner: unknown): this {
    return this
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async map<U>(okMapper: (inner: T) => Awaitable<U>): Promise<Ok<U>> {
    this.ignore()

    return new Ok<U>(await okMapper(this.inner))
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapSync<U>(okMapper: (inner: T) => U): Ok<U> {
    this.ignore()

    return new Ok<U>(okMapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async mapErr(errMapper: unknown): Promise<this> {
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
   * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async mapOr<U>(value: U, okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    this.ignore()

    return await okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapOrSync<U>(value: U, okMapper: (inner: T) => U): U {
    this.ignore()

    return okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
   */
  async mapOrElse<U>(errMapper: unknown, okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    this.ignore()

    return await okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
   */
  mapOrElseSync<U>(errMapper: unknown, okMapper: (inner: T) => U): U {
    this.ignore()

    return okMapper(this.inner)
  }

  /**
   * Return `value` if `Ok`, return `this` if `Err`
   * @param value 
   * @returns `value` if `Ok`, `this` if `Err`
   */
  and<U>(value: U): U {
    this.ignore()

    return value
  }

  /**
   * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async andThen<U>(okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    this.ignore()

    return await okMapper(this.inner)
  }

  /**
   * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  andThenSync<U>(okMapper: (inner: T) => U): U {
    this.ignore()

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
   * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async orElse(errMapper: unknown): Promise<this> {
    return this
  }

  /**
   * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param errMapper 
   * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  orElseSync(errMapper: unknown): this {
    return this
  }

  /**
   * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
   * @param result 
   * @returns `this` if `Err`, `this.inner` if `Ok`
   */
  flatten() {
    return this.inner
  }

}
