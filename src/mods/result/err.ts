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
   * @returns `err` if `err instanceof Err` and `err.inner instanceof type` for some `type` in `types`
   * @throws `err` if unable to do so
   */
  static innerCastOrThrow<T>(err: unknown, ...types: Class<T>[]) {
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
   * Throw the inner value or get the inner error
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr() {
    return this.inner
  }

  /**
   * Get the inner value or a default one
   * @param or 
   * @returns `this.inner` if `Ok`, `or` if `Err`
   */
  unwrapOr<U>(or: U) {
    return or
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param or 
   * @returns `this.inner` if `Ok`, `await or(this.inner)` if `Err`
   * @throws if `await or(this.inner)` throws
   */
  async unwrapOrElse<U>(or: (inner: T) => U) {
    return await or(this.inner)
  }

  /**
   * Get the inner value or compute a default one from the inner error
   * @param or 
   * @returns `this.inner` if `Ok`, `or(this.inner)` if `Err`
   * @throws if `or(this.inner)` throws
   */
  unwrapOrElseSync<U>(or: (inner: T) => U) {
    return or(this.inner)
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await() {
    return this
  }

  /**
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  map(mapper: unknown) {
    return this
  }

  /**
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapSync(mapper: unknown) {
    return this
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(await mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await mapper(this.inner)` throws
   */
  async mapErr<U>(mapper: (inner: T) => Promiseable<U>) {
    return new Err<U>(await mapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `mapper(this.inner)` throws
   */
  mapErrSync<U>(mapper: (inner: T) => U) {
    return new Err<U>(mapper(this.inner))
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `await mapper(this.inner)` if `Ok`, `or` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async mapOr<U>(or: U, mapper: unknown) {
    return or
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `mapper(this.inner)` if `Ok`, `or` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapOrSync<U>(or: U, mapper: unknown) {
    return or
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `await mapper(this.inner)` if `Ok`, `await or(this.inner)` if `Err`
   * @throws if `await mapper(this.inner)` or `await or(this.inner)` throws
   */
  async mapOrElse<U>(or: (inner: T) => Promiseable<U>, mapper: unknown) {
    return await or(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `mapper(this.inner)` if `Ok`, `or(this.inner)` if `Err`
   * @throws if `mapper(this.inner)` or `or(this.inner)` throws
   */
  mapOrElseSync<U>(or: (inner: T) => U, mapper: unknown) {
    return or(this.inner)
  }

  /**
   * Return `and` if `Ok`, return `this` if `Err`
   * @param and 
   * @returns `and` if `Ok`, `this` if `Err`
   */
  and(and: unknown) {
    return this
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  async andThen(callback: unknown) {
    return this
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  andThenSync(callback: unknown) {
    return this
  }

  /**
   * Return `or` if `Ok`, return `this` if `Err`
   * @param or 
   * @returns `or` if `Ok`, `this` if `Err`
   */
  or<U>(or: U) {
    return or
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  async orThen<U>(callback: (inner: T) => Promiseable<U>) {
    return await callback(this.inner)
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  orThenSync<U>(callback: (inner: T) => U) {
    return callback(this.inner)
  }

}