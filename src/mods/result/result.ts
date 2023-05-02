import { Promiseable } from "libs/promises/promises.js"
import { Class } from "libs/reflection/reflection.js"
import { Err, ErrInner } from "./err.js"
import { Ok, OkInner } from "./ok.js"

export interface Wrapper<T = unknown> {
  unwrap(): T
}

export type Result<T = unknown, E = unknown> =
  | Ok<T>
  | Err<E>

export namespace Result {

  /**
   * Rewrap any type that extends Ok into an Ok
   * @param wrapper 
   */
  export function rewrap<T extends Ok>(wrapper: T): Ok<OkInner<T>>

  /**
   * Rewrap any type that extends Err into an Err
   * @param wrapper 
   */
  export function rewrap<T extends Err>(wrapper: T): Err<ErrInner<T>>

  /**
   * Rewrap any type that extends Result into a Result
   * @param wrapper 
   */
  export function rewrap<T extends Result>(wrapper: T): Result<OkInner<T>, ErrInner<T>>

  /**
   * Rewrap any object with unwrap() into a Result
   * @param wrapper 
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
  export function unthrow<T, E>(callback: () => Promise<Result<T, E>>, ...types: Class<E>[]): Promise<Result<T, E>>

  /**
   * Catch an Err thrown from Err.throw
   * @param callback 
   * @param type 
   * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
   * @see Err.throw
   */
  export function unthrow<T, E>(callback: () => Result<T, E>, ...types: Class<E>[]): Result<T, E>

  export function unthrow<T, E>(callback: () => Promiseable<Result<T, E>>, ...types: Class<E>[]) {
    try {
      const promiseable = callback()

      if (promiseable instanceof Promise)
        return promiseable.catch(e => Err.castOrThrow(e, ...types))

      return promiseable
    } catch (e: unknown) {
      return Err.castOrThrow(e, ...types)
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
      return Err.castOrThrow(e, ...types)
    }
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function catchAndWrap<T, E>(callback: () => Promise<T>, ...types: Class<E>[]): Promise<Result<T, E>>

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function catchAndWrap<T, E>(callback: () => T, ...types: Class<E>[]): Result<T, E>

  export function catchAndWrap<T, E>(callback: () => Promiseable<T>, ...types: Class<E>[]) {
    try {
      const promiseable = callback()

      if (promiseable instanceof Promise)
        return promiseable
          .then(x => new Ok(x))
          .catch(e => Err.castAndWrapOrThrow(e, ...types))

      return new Ok(promiseable)
    } catch (e: unknown) {
      return Err.castAndWrapOrThrow(e, ...types)
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
    } catch (e: unknown) {
      return Err.castAndWrapOrThrow(e, ...types)
    }
  }

}