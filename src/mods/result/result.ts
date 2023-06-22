import { Option, Optional } from "@hazae41/option"
import { Promiseable } from "libs/promises/promises.js"
import { Err } from "./err.js"
import { Catched } from "./errors.js"
import { Ok } from "./ok.js"

export interface Wrapper<T = unknown> {
  unwrap(): T
}

export type Result<T = unknown, E = unknown> =
  | Ok<T>
  | Err<E>

export namespace Result {

  export type Infer<T> =
    | Ok.Infer<T>
    | Err.Infer<T>

  /**
   * Create a Result from a maybe Error value
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
   * Create a Result from a boolean
   * @param value 
   * @returns 
   */
  export function assert(value: boolean) {
    if (value)
      return new Ok(undefined)
    else
      return new Err(undefined)
  }

  /**
   * Rewrap any type that extends Ok into an Ok
   * @param wrapper 
   */
  export function rewrap<T extends Ok.Infer<T>>(wrapper: T): Ok<Ok.Inner<T>>

  /**
   * Rewrap any type that extends Err into an Err
   * @param wrapper 
   */
  export function rewrap<T extends Err.Infer<T>>(wrapper: T): Err<Err.Inner<T>>

  /**
   * Rewrap any type that extends Result into a Result
   * @param wrapper 
   */
  export function rewrap<T extends Result.Infer<T>>(wrapper: T): Result<Ok.Inner<T>, Err.Inner<T>>

  /**
   * Rewrap any object with unwrap() into a Result
   * @param wrapper 
   */
  export function rewrap<T, E>(wrapper: Wrapper<T>): Result<T, E>

  export function rewrap<T, E>(wrapper: Wrapper<T>) {
    try {
      return new Ok(wrapper.unwrap())
    } catch (error: unknown) {
      return new Err(error as E)
    }
  }

  /**
   * Catch an Err thrown from Err.throw
   * @param callback 
   * @param type 
   * @returns `Ok<T>` if no `Err` was thrown, `Err<E>` otherwise
   * @see Err.throw
   */
  export async function unthrow<R extends Result.Infer<R>>(callback: (thrower: (e: Err.Infer<R>) => void) => Promiseable<R>): Promise<R> {
    let ref: Err.Infer<R> | undefined

    try {
      return await callback((e: Err.Infer<R>) => ref = e)
    } catch (e: unknown) {
      if (ref !== undefined)
        return ref as R
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
  export function unthrowSync<R extends Result.Infer<R>>(callback: (thrower: (e: Err.Infer<R>) => void) => R): R {
    let ref: Err.Infer<R> | undefined

    try {
      return callback((e: Err.Infer<R>) => ref = e)
    } catch (e: unknown) {
      if (ref !== undefined)
        return ref as R
      throw e
    }
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export async function catchAndWrap<T>(callback: () => Promiseable<T>): Promise<Result<T, Catched>> {
    try {
      return new Ok(await callback())
    } catch (e: unknown) {
      return new Err(Catched.from(e))
    }
  }

  /**
   * Wrap with catching
   * @param callback 
   * @returns 
   */
  export function catchAndWrapSync<T>(callback: () => T): Result<T, Catched> {
    try {
      return new Ok(callback())
    } catch (e: unknown) {
      return new Err(Catched.from(e))
    }
  }

  /**
   * Catch
   * @param callback 
   * @returns 
   */
  export async function recatch<T, E>(callback: () => Promiseable<Result<T, E>>): Promise<Result<T, Catched | E>> {
    try {
      return await callback()
    } catch (e: unknown) {
      return new Err(Catched.from(e))
    }
  }

  /**
   * Catch
   * @param callback 
   * @returns 
   */
  export function recatchSync<T, E>(callback: () => Result<T, E>): Result<T, Catched | E> {
    try {
      return callback()
    } catch (e: unknown) {
      return new Err(Catched.from(e))
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

  export function maybeAll<T, E>(iterable: Iterable<Optional<Result<T, E>>>): Optional<Result<Array<T>, E>> {
    return maybeCollect(maybeIterate(iterable))
  }

  /**
   * Transform `Iterable<Result<T,E>` into `Iterator<T, Result<void, E>>`
   * @param iterable 
   * @returns `Iterator<T, Result<void, E>>`
   */
  export function* iterate<T, E>(iterable: Iterable<Result<T, E>>): Iterator<T, Result<void, E>> {
    for (const result of iterable) {
      if (result.isOk())
        yield result.get()
      else
        return result
    }

    return Ok.void()
  }

  export function* maybeIterate<T, E>(iterable: Iterable<Optional<Result<T, E>>>): Iterator<T, Optional<Result<void, E>>> {
    for (const result of iterable) {
      if (result === undefined)
        return undefined
      else if (result.isOk())
        yield result.get()
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

    let result = iterator.next()

    for (; !result.done; result = iterator.next())
      array.push(result.value)

    return result.value.set(array)
  }

  export function maybeCollect<T, E>(iterator: Iterator<T, Optional<Result<void, E>>>): Optional<Result<Array<T>, E>> {
    const array = new Array<T>()

    let result = iterator.next()

    for (; !result.done; result = iterator.next())
      array.push(result.value)

    return Option.mapSync(result.value, result => result.set(array))
  }

  /**
   * Call the callback:
   * - if it throws, wrap the thrown error into `Catched` and throw it
   * - if the result is `Err`, unwrap it and throw it 
   * - if the result is `Ok`, unwrap it and return it
   * @param callback 
   * @returns `T` if `Ok`
   * @throws `Catched` if `callback()` throws, `E` if `Err`
   */
  export async function catchAndUnwrap<T, E>(callback: () => Promise<Result<T, E>>) {
    let result: Result<T, E>

    try {
      result = await callback()
    } catch (e: unknown) {
      throw Catched.from(e)
    }

    return result.unwrap()
  }

  /**
   * Call the callback:
   * - if it throws, wrap the thrown error into `Catched` and throw it
   * - if the result is `Err`, unwrap it and throw it 
   * - if the result is `Ok`, unwrap it and return it
   * @param callback 
   * @returns `T` if `Ok`
   * @throws `Catched` if `callback()` throws, `E` if `Err`
   */
  export function catchAndUnwrapSync<T, E>(callback: () => Result<T, E>) {
    let result: Result<T, E>

    try {
      result = callback()
    } catch (e: unknown) {
      throw Catched.from(e)
    }

    return result.unwrap()
  }

  /**
   * Rethrow `CatchedError`
   * @param error 
   * @returns `Err(error)` if not `CatchedError` 
   * @throws `error.cause` if `CatchedError` 
   */
  export function rethrow(error: unknown) {
    if (error instanceof Catched)
      throw error.cause
    return new Err(error)
  }
}