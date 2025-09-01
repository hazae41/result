// deno-lint-ignore-file
import { None, NoneInit } from "../none/mod.ts";
import { Some, SomeInit } from "../some/mod.ts";

export type Nullable<T> =
  T | undefined | null

export type Optional<T> =
  T | undefined

export type NonOptional<T> =
  Exclude<T, undefined>

export type Option<T> =
  | Some<T>
  | None

export type OptionInit<T> =
  | SomeInit<T>
  | NoneInit

export namespace Option {

  export function from<T>(init: OptionInit<T>): Option<T> {
    if ("inner" in init)
      return new Some(init.inner)
    return new None()
  }

  /**
   * Create an Option from a nullable value
   * @param inner 
   * @returns `Some<T>` if `T`, `None` if `undefined`
   */
  export function wrap<T>(inner: Nullable<T>): Option<T> {
    if (inner == null)
      return new None()
    return new Some(inner)
  }

}