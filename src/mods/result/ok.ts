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
   * @param or 
   * @returns `this.inner` if `Ok`, `or` if `Err`
   */
  unwrapOr(or: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param or 
   * @returns `this.inner` if `Ok`, `await or(this.inner)` if `Err`
   * @throws if `await or(this.inner)` throws
   */
  unwrapOrElse(or: unknown): T {
    return this.inner
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param or 
   * @returns `this.inner` if `Ok`, `or(this.inner)` if `Err`
   * @throws if `or(this.inner)` throws
   */
  unwrapOrElseSync(or: unknown): T {
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
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async map<U>(mapper: (inner: T) => Promiseable<U>): Promise<Ok<U>> {
    return new Ok<U>(await mapper(this.inner))
  }

  /**
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapSync<U>(mapper: (inner: T) => U): Ok<U> {
    return new Ok<U>(mapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(await mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await mapper(this.inner)` throws
   */
  mapErr(mapper: unknown): this {
    return this
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `mapper(this.inner)` throws
   */
  mapErrSync(mapper: unknown): this {
    return this
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `await mapper(this.inner)` if `Ok`, `or` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async mapOr<U>(or: U, mapper: (inner: T) => Promiseable<U>): Promise<U> {
    return await mapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `mapper(this.inner)` if `Ok`, `or` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapOrSync<U>(or: U, mapper: (inner: T) => U): U {
    return mapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `await mapper(this.inner)` if `Ok`, `await or(this.inner)` if `Err`
   * @throws if `await mapper(this.inner)` or `await or(this.inner)` throws
   */
  async mapOrElse<U>(or: unknown, mapper: (inner: T) => Promiseable<U>): Promise<U> {
    return await mapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `mapper(this.inner)` if `Ok`, `or(this.inner)` if `Err`
   * @throws if `mapper(this.inner)` or `or(this.inner)` throws
   */
  mapOrElseSync<U>(or: unknown, mapper: (inner: T) => U): U {
    return mapper(this.inner)
  }

  /**
   * Return `and` if `Ok`, return `this` if `Err`
   * @param and 
   * @returns `and` if `Ok`, `this` if `Err`
   */
  and<U>(and: U): U {
    return and
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  async andThen<U>(callback: (inner: T) => Promiseable<U>): Promise<U> {
    return await callback(this.inner)
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  andThenSync<U>(callback: (inner: T) => U): U {
    return callback(this.inner)
  }

  /**
   * Return `or` if `Ok`, return `this` if `Err`
   * @param or 
   * @returns `or` if `Ok`, `this` if `Err`
   */
  or(or: unknown): this {
    return this
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  orThen(callback: unknown): this {
    return this
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  orThenSync(callback: unknown): this {
    return this
  }

}