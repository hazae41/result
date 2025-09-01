import type { Awaitable } from "@/libs/awaitable/mod.ts"
import { None, Some } from "@/mods/option/mod.ts"

// deno-lint-ignore no-namespace
export namespace Err {

  export type Infer<T> = Err<Inner<T>>

  export type Inner<T> = T extends Err<infer Inner> ? Inner : never

}

export class Err<T = unknown> {

  #inner: T

  /**
   * A failure
   * @param inner 
   */
  constructor(inner: T) {
    this.#inner = inner
  }

  /**
   * Create an empty `Err`
   * @returns `Err(void)`
   */
  static void(): Err<void> {
    return new Err<void>(undefined)
  }

  /**
   * Create an `Err`
   * @param inner 
   * @returns `Err(inner)`
   */
  static create<T>(inner: T): Err<T> {
    return new Err(inner)
  }

  /**
   * Create an `Err` with an `Error` inside
   * @param message 
   * @param options 
   * @returns `Err<Error>`
   */
  static error(message: string, options?: ErrorOptions): Err<Error> {
    return new Err(new Error(message, options))
  }

  get inner() {
    return this.#inner
  }

  [Symbol.dispose](this: Err<Disposable>) {
    this.#inner[Symbol.dispose]()
  }

  async [Symbol.asyncDispose](this: Err<AsyncDisposable>) {
    await this.#inner[Symbol.asyncDispose]()
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
   * @param _okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  isOkAnd(_okPredicate: unknown): false {
    return false
  }

  /**
   * Returns true if the result is `Ok` and the value inside of it matches a predicate
   * @param _okPredicate 
   * @returns `true` if `Ok` and `await okPredicate(this.inner)`, `false` otherwise
   */
  isOkAndSync(_okPredicate: unknown): false {
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
  async isErrAnd(errPredicate: (inner: T) => Awaitable<boolean>): Promise<boolean> {
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
   * Compile-time safely get Ok's inner type
   * @returns `this.inner`
   * @throws if `this` is `Err`
   */
  get(this: [T] extends [never] ? unknown : never): never {
    throw new Error()
  }

  /**
   * Compile-time safely get Err's inner type
   * @returns `this.inner`
   * @throws if `this` is `Ok`
   */
  getErr() {
    return this.inner
  }

  /**
   * Get inner type
   * @returns 
   */
  getAny(): T {
    return this.inner
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
  // deno-lint-ignore require-yield
  *[Symbol.iterator](): Iterator<never, void> {
    return
  }

  /**
   * Transform `Result<T,E>` into `[T,E]`
   * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
   */
  split(): [undefined, T] {
    return [undefined, this.inner]
  }

  /**
   * Returns true if the result is an `Ok` value containing the given value
   * @param _value 
   * @returns `true` if `Ok` and `this.inner === value`, `false` otherwise
   */
  contains(_value: unknown): false {
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
    throw this
  }

  /**
   * Get the inner value if Ok or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  getOrThrow(): never {
    throw this.inner
  }

  /**
   * Get the inner error if Err or throw the inner value
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  getErrOrThrow(): T {
    return this.inner
  }

  /**
   * Get the inner value if Ok or null if Err
   * @returns `this.inner` if `Ok`, `null` if `Err`
   */
  getOrNull(): null {
    return null
  }

  /**
   * Get the inner error if Err or null if Ok
   * @returns `this.inner` if `Err`, `null` if `Ok`
   */
  getErrOrNull(): T {
    return this.inner
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  getOr<U>(value: U): U {
    return value
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await errMapper(this.inner)` throws
   */
  async getOrElse<U>(errMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await errMapper(this.inner)
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  getOrElseSync<U>(errMapper: (inner: T) => U): U {
    return errMapper(this.inner)
  }

  /**
   * Get this if Ok or throw the inner error
   * @returns 
   */
  checkOrThrow(): never {
    throw this.inner
  }

  /**
   * Get this if Err or throw the inner value
   * @returns 
   */
  checkErrOrThrow(): this {
    return this
  }

  /**
   * Get this if Ok or return null
   * @returns 
   */
  checkOrNull(): null {
    return null
  }

  /**
   * Get this if Err or return null
   * @returns 
   */
  checkErrOrNull(): this {
    return this
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  await(): this {
    return this
  }

  /**
   * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Err`, `this` if `Ok`
   */
  async awaitErr<T>(this: Err<PromiseLike<T>>): Promise<Err<Awaited<T>>> {
    return new Err(await this.inner)
  }

  /**
   * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner`
   */
  async awaitAll<T>(this: Err<PromiseLike<T>>): Promise<Err<Awaited<T>>> {
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
    return Err.void()
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param _okCallback 
   * @returns `this`
   */
  inspect(_okCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param _okCallback 
   * @returns `this`
   */
  inspectSync(_okCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param errCallback 
   * @returns `this`
   */
  async inspectErr(errCallback: (inner: T) => Awaitable<void>): Promise<this> {
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
   * @param _inner 
   * @returns `Ok(inner)` if `Ok`, `this` if `Err`
   */
  set(_inner: unknown): this {
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
   * @param _okMapper 
   * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  map(_okMapper: unknown): this {
    return this
  }

  /**
   * Map the inner value into another
   * @param _okMapper 
   * @returns `Ok(okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapSync(_okMapper: unknown): this {
    return this
  }

  /**
   * Map the inner error into another
   * @param errMapper 
   * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  async mapErr<U>(errMapper: (inner: T) => Awaitable<U>): Promise<Err<U>> {
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
   * @param _okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  mapOr<U>(value: U, _okMapper: unknown): U {
    return value
  }

  /**
   * Map the inner value into another, or a default one
   * @param value
   * @param _okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapOrSync<U>(value: U, _okMapper: unknown): U {
    return value
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param _okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
   */
  async mapOrElse<U>(errMapper: (inner: T) => Awaitable<U>, _okMapper: unknown): Promise<U> {
    return await errMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param errMapper
   * @param _okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
   */
  mapOrElseSync<U>(errMapper: (inner: T) => U, _okMapper: unknown): U {
    return errMapper(this.inner)
  }

  /**
   * Return `value` if `Ok`, return `this` if `Err`
   * @param _value 
   * @returns `value` if `Ok`, `this` if `Err`
   */
  and(_value: unknown): this {
    return this
  }

  /**
   * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param _okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  andThen(_okMapper: unknown): this {
    return this
  }

  /**
   * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param _okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  andThenSync(_okMapper: unknown): this {
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
  async orElse<U>(errMapper: (inner: T) => Awaitable<U>): Promise<U> {
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

  /**
   * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
   * @param result 
   * @returns `this` if `Err`, `this.inner` if `Ok`
   */
  flatten() {
    return this
  }

}