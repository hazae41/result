import { Promiseable } from "libs/promises/promises.js"
import { Err } from "./error.js"

export class Ok<D>  {

  constructor(
    readonly inner: D
  ) { }

  static new<D>(inner: D) {
    return new this(inner)
  }

  /**
   * Type guard for Ok
   * @returns 
   */
  isOk(): this is Ok<D> {
    return true
  }

  isErr(): false {
    return false
  }

  unwrap() {
    return this.inner
  }

  /**
   * Map this data into another, throwing if mapper throws
   * @param mutator 
   * @returns 
   */
  async map<M>(mapper: (data: D) => Promiseable<M>) {
    return new Ok<M>(await mapper(this.inner))
  }

  /**
   * Try to map this data into another, returning Error if mapper throws
   * @param mapper 
   * @returns 
   */
  async tryMap<M>(mapper: (data: D) => Promiseable<M>) {
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
  mapSync<M>(mapper: (data: D) => M) {
    return new Ok<M>(mapper(this.inner))
  }

  /**
   * Try to map this data into another, returning Error if mapper throws
   * @param mapper 
   * @returns 
   */
  tryMapSync<M>(mapper: (data: D) => M) {
    try {
      return this.mapSync(mapper)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

}