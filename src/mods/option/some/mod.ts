import { Awaitable } from "@/libs/awaitable/mod.ts";
import { Ok } from "@/mods/result/mod.ts";
import { None } from "../none/mod.ts";
import { Option } from "../option/mod.ts";

export interface SomeInit<T> {
  readonly inner: T
}

export class Some<T> {

  /**
   * An existing value
   * @param inner 
   */
  constructor(
    readonly inner: T
  ) { }

  static create<T>(inner: T): Some<T> {
    return new Some<T>(inner)
  }

  static from<T>(init: SomeInit<T>) {
    return new Some<T>(init.inner)
  }

  /**
   * Returns an iterator over the possibly contained value
   * @yields `this.inner` if `Some`
   */
  *[Symbol.iterator](): Iterator<T, void> {
    yield this.inner
  }

  /**
   * Type guard for `Some`
   * @returns `true` if `Some`, `false` if `None`
   */
  isSome(): this is Some<T> {
    return true
  }

  /**
   * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
   * @param somePredicate 
   * @returns `true` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
   */
  async isSomeAnd(somePredicate: (inner: T) => Awaitable<boolean>): Promise<boolean> {
    return await somePredicate(this.inner)
  }

  /**
   * Returns `true` if the option is a `Some` and the value inside of it matches a predicate
   * @param somePredicate 
   * @returns `true` if `Some` and `somePredicate(this.inner)`, `None` otherwise
   */
  isSomeAndSync(somePredicate: (inner: T) => boolean): boolean {
    return somePredicate(this.inner)
  }

  /**
   * Type guard for `None`
   * @returns `true` if `None`, `false` if `Some`
   */
  isNone(): false {
    return false
  }

  /**
   * Compile-time safely get `this.inner`
   * @returns `this.inner`
   */
  get(): T {
    return this.inner
  }

  /**
   * Get the inner value or throw an error
   * @returns 
   */
  getOrThrow() {
    return this.inner
  }

  /**
   * Get the inner value or `null`
   * @returns 
   */
  getOrNull(): T {
    return this.inner
  }

  /**
   * Get the inner value or a default one
   * @param value 
   * @returns `this.inner` if `Some`, `value` if `None`
   */
  getOr(value: unknown): T {
    return this.inner
  }

  /**
   * Returns the contained `Some` value or computes it from a closure
   * @param noneCallback 
   * @returns `this.inner` if `Some`, `await noneCallback()` if `None`
   */
  async getOrElse(noneCallback: unknown): Promise<T> {
    return this.inner
  }

  /**
   * Returns the contained `Some` value or computes it from a closure
   * @param noneCallback 
   * @returns `this.inner` if `Some`, `noneCallback()` if `None`
   */
  getOrElseSync(noneCallback: unknown): T {
    return this.inner
  }

  /**
   * Transform `Option<T>` into `Result<T, NoneError>`
   * @returns `Ok(this.inner)` if `Some`, `Err(NoneError)` if `None`
   */
  ok(): Ok<T> {
    return new Ok(this.inner)
  }

  /**
   * Transform `Option<T>` into `Result<T, E>`
   * @param error
   * @returns `Ok(this.inner)` if `Some`, `Err(error)` if `None`
   */
  okOr(error: unknown): Ok<T> {
    return new Ok(this.inner)
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
   * @param noneCallback 
   * @returns `Ok(this.inner)` if `Some`, `Err(await noneCallback())` is `None`
   */
  async okOrElse(noneCallback: unknown): Promise<Ok<T>> {
    return new Ok(this.inner)
  }

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`
   * @param noneCallback 
   * @returns `Ok(this.inner)` if `Some`, `Err(noneCallback())` is `None`
   */
  okOrElseSync(noneCallback: unknown): Ok<T> {
    return new Ok(this.inner)
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
   * @param somePredicate 
   * @returns `Some` if `Some` and `await somePredicate(this.inner)`, `None` otherwise
   */
  async filter(somePredicate: (inner: T) => Awaitable<boolean>): Promise<Option<T>> {
    if (await somePredicate(this.inner))
      return this
    else
      return new None()
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `somePredicate` with the wrapped value
   * @param somePredicate 
   * @returns `Some` if `Some` and `somePredicate(this.inner)`, `None` otherwise
   */
  filterSync(somePredicate: (inner: T) => boolean): Option<T> {
    if (somePredicate(this.inner))
      return this
    else
      return new None()
  }

  /**
   * Transform `Option<Promise<T>>` into `Promise<Option<T>>`
   * @returns `Promise<Option<T>>`
   */
  async await(): Promise<Some<Awaited<T>>> {
    return new Some(await this.inner)
  }

  /**
   * Returns `true` if the option is a `Some` value containing the given value
   * @param value 
   * @returns `true` if `Some` and `this.inner === value`, `None` otherwise
   */
  contains(value: T): boolean {
    return this.inner === value
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param someCallback 
   * @returns `this`
   */
  async inspect(someCallback: (inner: T) => Awaitable<void>): Promise<this> {
    await someCallback(this.inner)
    return this
  }

  /**
   * Calls the given callback with the inner value if `Ok`
   * @param someCallback 
   * @returns `this`
   */
  inspectSync(someCallback: (inner: T) => void): this {
    someCallback(this.inner)
    return this
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
   * @param someMapper 
   * @returns `Some(await someMapper(this.inner))` if `Some`, `this` if `None`
   */
  async map<U>(someMapper: (inner: T) => Awaitable<U>): Promise<Some<U>> {
    return new Some<U>(await someMapper(this.inner))
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value (if `Some`) or returns `None` (if `None`)
   * @param someMapper 
   * @returns `Some(someMapper(this.inner))` if `Some`, `this` if `None`
   */
  mapSync<U>(someMapper: (inner: T) => U): Some<U> {
    return new Some<U>(someMapper(this.inner))
  }

  /**
   * Returns the provided default result (if none), or applies a function to the contained value (if any)
   * @param value 
   * @param someMapper 
   * @returns `value` if `None`, `await someMapper(this.inner)` if `Some`
   */
  async mapOr<U>(value: U, someMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await someMapper(this.inner)
  }

  /**
   * Returns the provided default result (if none), or applies a function to the contained value (if any)
   * @param value 
   * @param someMapper 
   * @returns `value` if `None`, `someMapper(this.inner)` if `Some`
   */
  mapOrSync<U>(value: U, someMapper: (inner: T) => U): U {
    return someMapper(this.inner)
  }

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any)
   * @param noneCallback 
   * @param someMapper 
   * @returns `await someMapper(this.inner)` if `Some`, `await noneCallback()` if `None`
   */
  async mapOrElse<U>(noneCallback: unknown, someMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await someMapper(this.inner)
  }

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any)
   * @param noneCallback 
   * @param someMapper 
   * @returns `someMapper(this.inner)` if `Some`, `noneCallback()` if `None`
   */
  mapOrElseSync<U>(noneCallback: unknown, someMapper: (inner: T) => U): U {
    return someMapper(this.inner)
  }

  /**
   * Returns `None` if the option is `None`, otherwise returns `value`
   * @param value 
   * @returns `None` if `None`, `value` if `Some`
   */
  and<U>(value: U): U {
    return value
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
   * @param someMapper 
   * @returns `None` if `None`, `await someMapper(this.inner)` if `Some`
   */
  async andThen<U>(someMapper: (inner: T) => Awaitable<U>): Promise<U> {
    return await someMapper(this.inner)
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls `someMapper` with the wrapped value and returns the result
   * @param someMapper 
   * @returns `None` if `None`, `someMapper(this.inner)` if `Some`
   */
  andThenSync<U>(someMapper: (inner: T) => U): U {
    return someMapper(this.inner)
  }

  /**
   * Returns `this` if `Some`, otherwise returns `value`
   * @param value 
   * @returns `this` if `Some`, `value` if `None`
   */
  or(value: unknown): this {
    return this
  }

  /**
   * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
   * @param noneCallback 
   * @returns `this` if `Some`, `await noneCallback()` if `None`
   */
  async orElse(noneCallback: unknown): Promise<this> {
    return this
  }

  /**
   * Returns `this` if `Some`, otherwise calls `noneCallback` and returns the result
   * @param noneCallback 
   * @returns `this` if `Some`, `noneCallback()` if `None`
   */
  orElseSync(noneCallback: unknown): this {
    return this
  }

  /**
   * Returns `Some` if exactly one of the options is `Some`, otherwise returns `None`
   * @param value 
   * @returns `None` if both are `Some` or both are `None`, the only `Some` otherwise
   */
  xor<U>(value: Option<U>): Option<T> {
    if (value.isSome())
      return new None()
    else
      return this
  }

  /**
   * Zips `this` with another `Option`
   * @param other 
   * @returns `Some([this.inner, other.inner])` if both are `Some`, `None` if one of them is `None`
   */
  zip<U>(other: Option<U>): Option<[T, U]> {
    if (other.isSome())
      return new Some<[T, U]>([this.inner, other.inner])
    else
      return other
  }

}