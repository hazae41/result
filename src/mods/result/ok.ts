import { None, Some } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"
import { Result } from "./result.js"

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
  static void() {
    return new this<void>(undefined)
  }

  /**
   * Create an `Ok`
   * @param inner 
   * @returns `Ok(inner)`
   */
  static new<T>(inner: T) {
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
  ok() {
    return new Some(this.inner)
  }

  /**
   * Transform `Result<T, E>` into `Option<E>`
   * @returns `Some(this.inner)` if `Err`, `None` if `Ok`
   */
  err() {
    return new None()
  }

  /**
   * Just like `unwrap` but it throws `this` instead of `this.inner`
   * @returns `this.inner` if `Ok`
   * @throws `this` if `Err` 
   * @see Result.unthrow
   * @see Result.unthrowSync
   */
  throw() {
    return this.inner
  }

  /**
   * Get the inner value or throw the inner error
   * @returns `this.inner` if `Ok`
   * @throws `this.inner` if `Err` 
   */
  unwrap() {
    return this.inner
  }

  /**
   * Throw the inner value or get the inner error
   * @returns `this.inner` if `Err`
   * @throws `this.inner` if `Ok` 
   */
  unwrapErr() {
    throw this.inner
  }

  /**
   * Get the inner value or a default one
   * @param or 
   * @returns `this.inner` if `Ok`, `or` if `Err`
   */
  unwrapOr(or: unknown) {
    return this.inner
  }

  /**
   * Transform Result<Promise<T>, E> into Promise<Result<T, E>>
   * @returns `await this.inner` if `Ok`, `this` if `Err`
   */
  async await() {
    return new Ok(await this.inner)
  }

  /**
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async map<M>(mapper: (inner: T) => Promiseable<M>) {
    return new Ok<M>(await mapper(this.inner))
  }

  /**
   * Map the inner value into another
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `this` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapSync<M>(mapper: (inner: T) => M) {
    return new Ok<M>(mapper(this.inner))
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(await mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `await mapper(this.inner)` throws
   */
  mapErr(mapper: unknown) {
    return this
  }

  /**
   * Map the inner error into another
   * @param mapper 
   * @returns `Err(mapper(this.inner))` if `Err`, `this` if `Ok`
   * @throws if `mapper(this.inner)` throws
   */
  mapErrSync(mapper: unknown) {
    return this
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `Ok(await mapper(this.inner))` if `Ok`, `or` if `Err`
   * @throws if `await mapper(this.inner)` throws
   */
  async mapOr<M>(or: M, mapper: (inner: T) => Promiseable<M>) {
    return await mapper(this.inner)
  }

  /**
   * Map the inner value into another, or a default one
   * @param mapper 
   * @returns `Ok(mapper(this.inner))` if `Ok`, `or` if `Err`
   * @throws if `mapper(this.inner)` throws
   */
  mapOrSync<M>(or: M, mapper: (inner: T) => M) {
    return mapper(this.inner)
  }

  /**
   * Return `and` if `Ok`, return `this` if `Err`
   * @param and 
   * @returns `and` if `Ok`, `this` if `Err`
   */
  and<T>(and: T) {
    return and
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  async andThen<U>(callback: (inner: T) => Promiseable<U>) {
    return await callback(this.inner)
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  andThenSync<U>(callback: (inner: T) => U) {
    return callback(this.inner)
  }

  /**
   * Return `or` if `Ok`, return `this` if `Err`
   * @param or 
   * @returns `or` if `Ok`, `this` if `Err`
   */
  or(or: unknown) {
    return this
  }

  /**
   * Return `await callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `await callback()` if `Ok`, `this` if `Err`
   * @throws if `await callback()` throws
   */
  async orThen(callback: unknown) {
    return this
  }

  /**
   * Return `callback()` if `Ok`, return `this` if `Err`
   * @param callback 
   * @returns `callback()` if `Ok`, `this` if `Err`
   * @throws if `callback()` throws
   */
  orThenSync(callback: unknown) {
    return this
  }

}