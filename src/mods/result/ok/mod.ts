import type { Awaitable } from "@/libs/awaitable/mod.ts";
import { None, Some } from "@/mods/option/mod.ts";

// deno-lint-ignore no-namespace
export namespace Ok {

  export type Infer<T> = Ok<Inner<T>>

  export type Inner<T> = T extends Ok<infer Inner> ? Inner : never

}

export class Ok<T = unknown> {

  #inner: T

  /**
   * A success
   * @param inner 
   */
  constructor(inner: T) {
    this.#inner = inner
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
  static create<T>(inner: T): Ok<T> {
    return new Ok<T>(inner)
  }

  get inner(): T {
    return this.#inner
  }

  [Symbol.dispose](this: Ok<Disposable>) {
    this.#inner[Symbol.dispose]()
  }

  async [Symbol.asyncDispose](this: Ok<AsyncDisposable>) {
    await this.#inner[Symbol.asyncDispose]()
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
   * @param _errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  isErrAnd(_errPredicate: unknown): false {
    return false
  }

  /**
   * Returns true if the result is `Err` and the value inside of it matches a predicate
   * @param _errPredicate 
   * @returns `true` if `Err` and `await errPredicate(this.inner)`, `false` otherwise
   */
  isErrAndSync(_errPredicate: unknown): false {
    return false
  }

  /**
   * Compile-time safely get Ok's inner type
   * @returns `this.inner`
   * @throws if `this` is `Err`
   */
  get(): T {
    return this.inner
  }

  /**
   * Compile-time safely get Err's inner type
   * @returns `this.inner`
   * @throws if `this` is `Ok`
   */
  getErr(this: [T] extends [never] ? unknown : never): never {
    throw new Error()
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
   * Transform `Result<T,E>` into `[T,E]`
   * @returns `[this.inner, undefined]` if `Ok`, `[undefined, this.inner]` if `Err`
   */
  split(): [T, undefined] {
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
   * @param _value 
   * @returns `true` if `Err` and `this.inner === value`, `false` otherwise
   */
  containsErr(_value: unknown): false {
    return false
  }

  /**
   * Just like `unwrap` but it throws to the closest `Result.unthrow`
   * @returns `this.inner` if `Ok`
   * @throws `this` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw(_thrower: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value if Ok or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  getOrThrow(): T {
    return this.inner
  }

  /**
   * Get the inner error if Err or throw the inner value
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  getErrOrThrow(): never {
    throw this.inner
  }

  /**
   * Get the inner value if Ok or null if Err
   * @returns `this.inner` if `Ok`, `null` if `Err`
   */
  getOrNull(): T {
    return this.inner
  }

  /**
   * Get the inner error if Err or null if Ok
   * @returns `this.inner` if `Err`, `null` if `Ok`
   */
  getErrOrNull(): null {
    return null
  }

  /**
   * Get the inner value or a default one
   * @param _value 
   * @returns `this.inner` if `Ok`, `value` if `Err`
   */
  getOr(_value: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param _errMapper 
   * @returns `this.inner` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await errMapper(this.inner)` throws
   */
  getOrElse(_errMapper: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param _errMapper 
   * @returns `this.inner` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `errMapper(this.inner)` throws
   */
  getOrElseSync(_errMapper: unknown): T {
    return this.inner
  }

  /**
   * Get this if Ok or throw the inner error
   * @returns 
   */
  checkOrThrow(): this {
    return this
  }

  /**
   * Get this if Err or throw the inner value
   */
  checkErrOrThrow(): never {
    throw this.inner
  }

  /**
   * Get this if Ok or return null
   * @returns 
   */
  checkOrNull(): this {
    return this
  }

  /**
   * Get this if Err or return null
   */
  checkErrOrNull(): null {
    return null
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await<T>(this: Ok<PromiseLike<T>>): Promise<Ok<Awaited<T>>> {
    return new Ok(await this.inner)
  }

  /**
   * Transform Result<T, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Err`, `this` if `Ok`
   */
  awaitErr(): this {
    return this
  }

  /**
   * Transform Result<Promise<T>, Promise<E>> into Promise<Result<T, E>>
   * @returns `await this.inner`
   */
  async awaitAll<T>(this: Ok<PromiseLike<T>>): Promise<Ok<Awaited<T>>> {
    return await this.await()
  }

  /**
   * Transform `Result<T, E>` into `Result<void, E>`
   * @returns `Ok<void>` if `Ok<T>`, `Err<E>` if `E<E>`
   */
  clear(): Ok<void> {
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
   * @param _errCallback 
   * @returns `this`
   */
  inspectErr(_errCallback: unknown): this {
    return this
  }

  /**
   * Calls the given callback with the inner value if `Err`
   * @param _errCallback 
   * @returns `this`
   */
  inspectErrSync(_errCallback: unknown): this {
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
   * @param _inner 
   * @returns `Err(inner)` if `Err`, `this` if `Ok`
   */
  setErr(_inner: unknown): this {
    return this
  }

  /**
   * Map the inner value into another
   * @param okMapper 
   * @returns `Ok(await okMapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async map<U>(okMapper: (inner: T) => Awaitable<U>): Promise<Ok<U>> {
    return new Ok<U>(await okMapper(this.inner))
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
   * @param _errMapper 
   * @returns `Err(await errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  mapErr(_errMapper: unknown): this {
    return this
  }

  /**
   * Map the inner error into another
   * @param _errMapper 
   * @returns `Err(errMapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  mapErrSync(_errMapper: unknown): this {
    return this
  }

  /**
   * Map the inner value into another, or a default one
   * @param _value
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async mapOr<U>(_value: U, okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param _value
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `value` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  mapOrSync<U>(_value: U, okMapper: (inner: T) => U): U {
    return okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param _errMapper
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `await errMapper(this.inner)` if `Err`
   * @throws if `await okMapper(this.inner)` or `await errMapper(this.inner)` throws
   */
  async mapOrElse<U>(_errMapper: unknown, okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await okMapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param _errMapper
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `errMapper(this.inner)` if `Err`
   * @throws if `okMapper(this.inner)` or `errMapper(this.inner)` throws
   */
  mapOrElseSync<U>(_errMapper: unknown, okMapper: (inner: T) => U): U {
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
   * Return `await okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `await okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `await okMapper(this.inner)` throws
   */
  async andThen<U>(okMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await okMapper(this.inner)
  }

  /**
   * Return `okMapper(this.inner)` if `Ok`, return `this` if `Err`
   * @param okMapper 
   * @returns `okMapper(this.inner)` if `Ok`, `this` if `Err`
   * @throws if `okMapper(this.inner)` throws
   */
  andThenSync<U>(okMapper: (inner: T) => U): U {
    return okMapper(this.inner)
  }

  /**
   * Return `value` if `Err`, return `this` if `Ok`
   * @param _value 
   * @returns `value` if `Err`, `this` if `Ok`
   */
  or(_value: unknown): this {
    return this
  }

  /**
   * Return `await errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param _errMapper 
   * @returns `await errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `await errMapper(this.inner)` throws
   */
  orElse(_errMapper: unknown): this {
    return this
  }

  /**
   * Return `errMapper(this.inner)` if `Err`, return `this` if `Ok`
   * @param _errMapper 
   * @returns `errMapper(this.inner)` if `Err`, `this` if `Ok`
   * @throws if `errMapper(this.inner)` throws
   */
  orElseSync(_errMapper: unknown): this {
    return this
  }

  /**
   * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
   * @param result 
   * @returns `this` if `Err`, `this.inner` if `Ok`
   */
  flatten(): T {
    return this.inner
  }

}
