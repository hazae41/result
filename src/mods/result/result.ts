import { Promiseable } from "libs/promises/promises.js"
import { Err, ErrInner } from "./err.js"
import { Ok, OkInner } from "./ok.js"

export type Result<D = unknown, E = unknown> =
  | Ok<D>
  | Err<E>

export interface Wrapper<D = unknown> {
  unwrap(): D
}

export namespace Result {

  /**
   * Rewrap any type that extends Ok into an Ok
   * @param wrapper 
   * @returns 
   */
  export function rewrap<T extends Ok>(wrapper: T): Ok<OkInner<T>>

  /**
   * Rewrap any type that extends Err into an Err
   * @param wrapper 
   * @returns 
   */
  export function rewrap<T extends Err>(wrapper: T): Err<ErrInner<T>>

  /**
   * Rewrap any type that extends Result into a Result
   * @param wrapper 
   * @returns 
   */
  export function rewrap<T extends Result>(wrapper: T): Result<OkInner<T>, ErrInner<T>>

  /**
   * Rewrap any object with unwrap()
   * @param wrapper 
   * @returns 
   */
  export function rewrap<T>(wrapper: Wrapper<T>): Result<T>

  export function rewrap<T>(wrapper: Wrapper<T>) {
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
  export async function wrap<T>(callback: () => Promiseable<T>) {
    return new Ok(await callback())
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export async function catchAndWrap<T>(callback: () => Promiseable<T>) {
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
  export function wrapSync<T>(callback: () => T) {
    return new Ok(callback())
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function catchAndWrapSync<T>(callback: () => T) {
    try {
      return wrapSync(callback)
    } catch (error: unknown) {
      return new Err(error)
    }
  }

}