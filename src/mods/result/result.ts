import { Promiseable } from "libs/promises/promises.js"
import { Class } from "libs/reflection/reflection.js"
import { Err, ErrInner } from "./err.js"
import { Ok, OkInner } from "./ok.js"

export type Result<T = unknown, E = unknown> =
  | Ok<T>
  | Err<E>

export interface Wrapper<T = unknown> {
  unwrap(): T
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
   * Rewrap any object with unwrap() into a Result
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
   * Catch an Err thrown from Err.throw
   * @param callback 
   * @param type 
   * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
   * @see Err.throw
   */
  export async function unthrow<T, E>(callback: () => Promiseable<Result<T, E>>, ...types: Class<E>[]) {
    try {
      return await callback()
    } catch (e: unknown) {
      return Err.innerCastOrThrow(e, ...types)
    }
  }

  /**
   * Catch an Err thrown from Err.throw
   * @param callback 
   * @param type 
   * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
   * @see Err.throw
   */
  export function unthrowSync<T, E>(callback: () => Result<T, E>, ...types: Class<E>[]) {
    try {
      return callback()
    } catch (e: unknown) {
      return Err.innerCastOrThrow(e, ...types)
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
  export async function catchAndWrap<T, E>(callback: () => Promiseable<T>, ...types: Class<E>[]) {
    try {
      return new Ok(await callback())
    } catch (error: unknown) {
      return Err.castOrThrow(error, ...types)
    }
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function catchAndWrapSync<T, E>(callback: () => T, ...types: Class<E>[]) {
    try {
      return new Ok(callback())
    } catch (error: unknown) {
      return Err.castOrThrow(error, ...types)
    }
  }

}