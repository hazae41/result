import { Promiseable } from "libs/promises/promises.js"
import { Ok } from "./data.js"
import { Err } from "./error.js"

export type Result<D = unknown, E = unknown> =
  | Ok<D>
  | Err<E>

export interface Wrapper<D> {
  unwrap(): D
}

export namespace Result {

  /**
   * Rewrap any object with unwrap()
   * @param wrapper 
   * @returns 
   */
  export function rewrap<D>(wrapper: Wrapper<D>) {
    try {
      return new Ok(wrapper.unwrap())
    } catch (error: unknown) {
      return new Err(error)
    }
  }

  /**
   * Wrap without catching
   * @param callback 
   * @returns 
   */
  export async function wrap<D>(callback: () => Promiseable<D>) {
    return new Ok(await callback())
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export async function tryWrap<D>(callback: () => Promiseable<D>) {
    try {
      return await wrap(callback)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

  /**
   * Wrap without catching
   * @param callback 
   * @returns 
   */
  export function wrapSync<D>(callback: () => D) {
    return new Ok(callback())
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function tryWrapSync<D>(callback: () => D) {
    try {
      return wrapSync(callback)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

}