import type { Awaitable } from "@/libs/awaitable/mod.ts";
import type { Nullable } from "@/libs/nullable/mod.ts";
import { Catched } from "../catched/mod.ts";
import { Err } from "../err/mod.ts";
import { Ok } from "../ok/mod.ts";

export interface Unwrappable<T = unknown> {
  getOrThrow(): T
}

/**
 * An object that can be either an Ok or an Err
 */
export type Result<T = unknown, E = unknown> =
  | Ok<T>
  | Err<E>

/**
 * A result whose Ok type is the same as its Err type
 * @example An `update<T>(): Fallback<T>` will return `Ok<T>` if an update was found and `Err<T>` if not
 */
export type Fallback<T> = Result<T, T>

// deno-lint-ignore no-namespace
export namespace Result {

  export type Infer<T> =
    | Ok.Infer<T>
    | Err.Infer<T>

  /**
   * Create a Result from a maybe Error value
   * @param inner 
   * @returns `Ok<T>` if `T`, `Err<Error>` if `Error`
   */
  export function from<T>(inner: T | Error): Ok<T> | Err<Error> {
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
  export function assert(value: boolean): Ok<void> | Err<void> {
    return value ? Ok.void() : Err.void()
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
   * Rewrap any object with getOrThrow() into a Result
   * @param wrapper 
   */
  export function rewrap<T, E>(wrapper: Unwrappable<T>): Result<T, E>

  export function rewrap<T, E>(wrapper: Unwrappable<T>) {
    try {
      return new Ok(wrapper.getOrThrow())
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
   * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<unknown>
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
   * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<unknown>
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
   * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<Catched>
   * @param callback 
   * @returns 
   */
  export async function runAndDoubleWrap<T>(callback: () => Awaitable<T>): Promise<Result<T, Error>> {
    try {
      return new Ok(await callback())
    } catch (e: unknown) {
      return new Err(Catched.wrap(e))
    }
  }

  /**
   * Run a callback and wrap any returned value in Ok<T> and any thrown error in Err<Catched>
   * @param callback 
   * @returns 
   */
  export function runAndDoubleWrapSync<T>(callback: () => T): Result<T, Error> {
    try {
      return new Ok(callback())
    } catch (e: unknown) {
      return new Err(Catched.wrap(e))
    }
  }

  /**
   * Run a callback and wrap any thrown error in Err<unknown>
   * @param callback 
   * @returns 
   */
  export async function runOrWrap<R extends Result.Infer<R>>(callback: () => Awaitable<R>): Promise<R | Err<unknown>> {
    try {
      return await callback()
    } catch (e: unknown) {
      return new Err(e)
    }
  }

  /**
   * Run a callback and wrap any thrown error in Err<unknown>
   * @param callback 
   * @returns 
   */
  export function runOrWrapSync<R extends Result.Infer<R>>(callback: () => R): R | Err<unknown> {
    try {
      return callback()
    } catch (e: unknown) {
      return new Err(e)
    }
  }

  /**
   * Run a callback and wrap any thrown error in Err<unknown>
   * @param callback 
   * @returns 
   */
  export async function runOrDoubleWrap<R extends Result.Infer<R>>(callback: () => Awaitable<R>): Promise<R | Err<Error>> {
    try {
      return await callback()
    } catch (e: unknown) {
      return new Err(Catched.wrap(e))
    }
  }

  /**
   * Run a callback and wrap any thrown error in Err<unknown>
   * @param callback 
   * @returns 
   */
  export function runOrDoubleWrapSync<R extends Result.Infer<R>>(callback: () => R): R | Err<Error> {
    try {
      return callback()
    } catch (e: unknown) {
      return new Err(Catched.wrap(e))
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

    if (result.value == null)
      return

    return result.value.set(array)
  }

}