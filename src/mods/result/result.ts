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
   * Create an Option from a maybe Error value
   * @param inner 
   * @returns `Ok<T>` if `T`, `Err<Error>` if `Error`
   */
  export function from<T>(inner: T | Error) {
    if (inner instanceof Error)
      return new Err(inner)
    else
      return new Ok(inner)
  }

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
  export async function unthrow<T, E>(callback: (thrower: (e: Err<E>) => void) => Promiseable<Result<T, E>>) {
    let ref: Err<E> | undefined

    try {
      return await callback((e: Err<E>) => ref = e)
    } catch (e: unknown) {
      if (ref !== undefined)
        return ref
      throw e
    }
  }

  /**
   * Catch an Err thrown from Err.throw
   * @param callback 
   * @param type 
   * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
   * @see Err.throw
   */
  export function unthrowSync<T, E>(callback: (thrower: (e: Err<E>) => void) => Result<T, E>) {
    let ref: Err<E> | undefined

    try {
      return callback((e: Err<E>) => ref = e)
    } catch (e: unknown) {
      if (ref !== undefined)
        return ref
      throw e
    }
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export async function catchAndWrap<T, E>(callback: () => Promiseable<T>, ...types: Class<E>[]) {
    try {
      return new Ok(await callback())
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

  /**
   * Transform `Iterable<Result<T,E>` into `Result<Array<T>, E>`
   * @param iterable 
   * @returns `Result<Array<T>, E>`
   */
  export function all<T, E>(iterable: Iterable<Result<T, E>>): Result<Array<T>, E> {
    return collect(iterate(iterable))
  }

  /**
   * Transform `Iterable<Result<T,E>` into `Iterator<T, Result<void, E>>`
   * @param iterable 
   * @returns `Iterator<T, Result<void, E>>`
   */
  export function* iterate<T, E>(iterable: Iterable<Result<T, E>>): Iterator<T, Result<void, E>> {
    for (const result of iterable) {
      if (result.isOk())
        yield result.inner
      else
        return result
    }

    return Ok.void()
  }

  /**
   * Transform `Iterator<T, Result<void, E>>` into `Result<Array<T>, E>`
   * @param iterator `Result<Array<T>, E>`
   */
  export function collect<T, E>(iterator: Iterator<T, Result<void, E>>): Result<Array<T>, E> {
    const array = new Array<T>()

    let result: IteratorResult<T, Result<void, E>>

    while (!(result = iterator.next()).done)
      array.push(result.value)

    if (result.value.isErr())
      return result.value

    return new Ok(array)
  }

}