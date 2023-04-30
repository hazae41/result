import { None, Some } from "@hazae41/option"
import { Class } from "libs/reflection/reflection.js"

export type ErrInner<E> = E extends Err<infer T> ? T : never

export class Err<T = unknown>  {

  constructor(
    readonly inner: T
  ) { }

  static new<T>(inner: T) {
    return new this(inner)
  }

  /**
   * 
   * @param message 
   * @param options 
   * @returns 
   */
  static error(message: string, options?: ErrorOptions) {
    return new this(new Error(message, options))
  }

  /**
   * Try to cast `e` into `type` and return `Err(e)`, throw `e` if unable to do so
   * @param e 
   * @param type 
   * @returns 
   */
  static cast<T>(e: unknown, type: Class<T>) {
    if (e instanceof type)
      return new this(e)
    else
      throw e
  }

  /**
   * Try to cast `e` into `type` and return `Err(e)`, return `Err(or)` if unable to do so
   * @param e 
   * @param type 
   * @returns 
   */
  static castOr<T>(e: unknown, type: Class<T>, or: T) {
    if (e instanceof type)
      return new this(e)
    else
      return new this(or)
  }

  isOk(): false {
    return false
  }

  /**
   * Type guard for Err
   * @returns 
   */
  isErr(): this is Err<T> {
    return true
  }

  unwrap(): never {
    throw this.inner
  }

  unwrapOr<O>(or: O) {
    return or
  }

  ok() {
    return new None()
  }

  err() {
    return new Some(this.inner)
  }

  map(mapper: unknown) {
    return this
  }

  tryMap(mapper: unknown) {
    return this
  }

  mapSync(mapper: unknown) {
    return this
  }

  tryMapSync(mapper: unknown) {
    return this
  }

}