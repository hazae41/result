import { None, Some } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"
import { Err } from "./err.js"

export type OkInner<O> = O extends Ok<infer T> ? T : never

export class Ok<T = unknown>  {

  constructor(
    readonly inner: T
  ) { }

  static void() {
    return new this<void>(undefined)
  }

  static new<T>(inner: T) {
    return new this<T>(inner)
  }

  /**
   * Type guard for Ok
   * @returns 
   */
  isOk(): this is Ok<T> {
    return true
  }

  isErr(): false {
    return false
  }

  unwrap() {
    return this.inner
  }

  unwrapOr(or: unknown) {
    return this.inner
  }

  ok() {
    return new Some(this.inner)
  }

  err() {
    return new None()
  }

  /**
   * Map this data into another, throwing if mapper throws
   * @param mutator 
   * @returns 
   */
  async map<M>(mapper: (inner: T) => Promiseable<M>) {
    return new Ok<M>(await mapper(this.inner))
  }

  /**
   * Try to map this data into another, returning Error if mapper throws
   * @param mapper 
   * @returns 
   */
  async tryMap<M>(mapper: (inner: T) => Promiseable<M>) {
    try {
      return await this.map(mapper)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

  /**
   * Map this data into another, throwing if mapper throws
   * @param mutator 
   * @returns 
   */
  mapSync<M>(mapper: (inner: T) => M) {
    return new Ok<M>(mapper(this.inner))
  }

  /**
   * Try to map this data into another, returning Error if mapper throws
   * @param mapper 
   * @returns 
   */
  tryMapSync<M>(mapper: (inner: T) => M) {
    try {
      return this.mapSync(mapper)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

}