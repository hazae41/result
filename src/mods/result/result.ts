import { Nullable, Option } from "@hazae41/option"
import { Awaitable } from "libs/promises/promises.js"
import { Err } from "./err.js"
import { AssertError, Catched } from "./errors.js"
import { Ok } from "./ok.js"

export interface Unwrappable<T = unknown> {
  unwrap(): T
}

export type Result<T = unknown, E = unknown> =
  | Ok<T>
  | Err<E>

export namespace Result {

  export type Infer<T> =
    | Ok.Infer<T>
    | Err.Infer<T>

  export let debug = false

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
    return value ? Ok.void() : new Err(new AssertError())
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
  export function rewrap<T, E>(wrapper: Unwrappable<T>): Result<T, E>

  export function rewrap<T, E>(wrapper: Unwrappable<T>) {
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
  export async function unthrow<R extends Result.Infer<R>>(callback: (thrower: (e: Err.Infer<R>) => void) => Awaitable<R>): Promise<R> {
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
   * Convert try-catch to Result<T, unknown>
   * @param callback 
   * @returns 
   */
  export async function runAndWrap<T>(callback: () => Awaitable<T>): Promise<Result<T, unknown>> {
    try {
      return new Ok(await callback())
    } catch (e: unknown) {
      return new Err(e)
    }
  }

  /**
   * Convert try-catch to Result<T, unknown>
   * @param callback 
   * @returns 
   */
  export function runAndWrapSync<T>(callback: () => T): Result<T, unknown> {
    try {
      return new Ok(callback())
    } catch (e: unknown) {
      return new Err(e)
    }
  }

  /**
   * Convert try-catch to Result<T, Catched>
   * @param callback 
   * @returns 
   */
  export async function runAndDoubleWrap<T>(callback: () => Awaitable<T>): Promise<Result<T, Catched>> {
    return runAndWrap(callback).then(r => r.mapErrSync(Catched.from))
  }

  /**
   * Convert try-catch to Result<T, Catched>
   * @param callback 
   * @returns 
   */
  export function runAndDoubleWrapSync<T>(callback: () => T): Result<T, Catched> {
    return runAndWrapSync(callback).mapErrSync(Catched.from)
  }

  /**
   * Transform Result<Result<T, E1>, E2> into Result<T, E1 | E2>
   * @param result 
   * @returns 
   */
  export function flatten<T, E1, E2>(result: Result<Result<T, E1>, E2>): Result<T, E1 | E2> {
    if (result.isErr())
      return result
    return result.get()
  }

  /**
   * Transform `Iterable<Result<T,E>` into `Result<Array<T>, E>`
   * @param iterable 
   * @returns `Result<Array<T>, E>`
   */
  export function all<T, E>(iterable: Iterable<Result<T, E>>): Result<Array<T>, E> {
    return collect(iterate(iterable))
  }

  export function maybeAll<T, E>(iterable: Iterable<Nullable<Result<T, E>>>): Nullable<Result<Array<T>, E>> {
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

  export function* maybeIterate<T, E>(iterable: Iterable<Nullable<Result<T, E>>>): Iterator<T, Nullable<Result<void, E>>> {
    for (const result of iterable) {
      if (result == null)
        return result
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

  export function maybeCollect<T, E>(iterator: Iterator<T, Nullable<Result<void, E>>>): Nullable<Result<Array<T>, E>> {
    const array = new Array<T>()

    let result = iterator.next()

    for (; !result.done; result = iterator.next())
      array.push(result.value)

    return Option.mapSync(result.value, result => result.set(array))
  }

  /**
   * Unwrap the callback but wrap thrown errors in Catched
   * @param callback 
   * @returns `T` if `Ok`
   * @throws `Catched` if `callback()` throws, `E` if `Err`
   */
  export async function runAndUnwrap<T, E>(callback: () => Promise<Result<T, E>>) {
    let result: Result<T, E>

    try {
      result = await callback()
    } catch (e: unknown) {
      throw Catched.from(e)
    }

    return result.unwrap()
  }

  /**
   * Unwrap the callback but wrap thrown errors in Catched
   * @param callback 
   * @returns `T` if `Ok`
   * @throws `Catched` if `callback()` throws, `E` if `Err`
   */
  export function runAndUnwrapSync<T, E>(callback: () => Result<T, E>) {
    let result: Result<T, E>

    try {
      result = callback()
    } catch (e: unknown) {
      throw Catched.from(e)
    }

    return result.unwrap()
  }



}