# Result

Rust-like Result for TypeScript

```bash
npm i @hazae41/result
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/result)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Similar to Rust
- `wrap()`/`unwrap()`/`rewrap()` conversion (async/sync)
- `ok()`/`err()` for converting to Option from `@hazae41/option` (with optional chaining `?.`)
- `isOk()`/`isErr()` type guards
- `map()`/`tryMap()` mapping (async/sync)
- `unwrapOr()` default value

## Why

When designing a function, you never know how to return that the action failed

### If you throw an Error

This is the standard way of dealing with errors

But you are forced to try-catch, you also need to be aware that the function may throw

```typescript
// does this throw? I don't know
function doSomething(): string

try {
  const result = doSomething()
  // use result
} catch(e: unknown) {
  // use e (you don't know what it is)
}
```

And the error is not typed, so you often end up checking if that's an error, and if it is not, you don't know what to do

```typescript
try { 
  // ...
} catch(e: unknown) {
  if (e instanceof Error)
    // use e
  else
    // what should I do now? rethrow?
}
```

### If you return an error

The advantage is that the error is explicit (you know it can fail) and typed

But you have to check for `instanceof Error` each time

```typescript
function doSomething(): string | Error

const result = doSomething()

if (result instanceof Error)
  throw result

// use result
```

### If you return undefined

The advantage is that you can use optional chaining `?.`

```typescript
function doSomething(): string | undefined

const maybeSlice = doSomething()?.slice(0, 5)
```

But if you want to throw, you have to explicitly check for `undefined`, and the "burden of naming the error" is on you instead of the function you used

```typescript
function doSomething(): string | undefined

const result = doSomething()

if (result === undefined)
  throw new Error(`something failed, idk`)

// use result
```

And `undefined` may mean something else, for example, a function that reads from IndexedDB:

```typescript
function read<T>(key: string): T | undefined
```

Does `undefined` mean that the read failed? Or does it mean that the key doesn't exist?

### If you return a Result

This is the way

It's a simple object that allows you to do all of the methods above, and even more: 
- Throw with `unwrap()`
- Get the data and error with `ok()` and `err()`, with support for optional chaining `?.` 
- Check the data and error with `isOk()` and `isErr()` type guards
- Map the data and error with `map()` and `mapErr()`
- Use a default value with `unwrapOr()`

## Usage

### Unwrapping

Use `unwrap()` to get the inner data if Ok or throw the inner error if Err

```typescript
import { Result, Ok, Err } from "@hazae41/result"

function unwrapAndIncrement(result: Result<number>): number {
  return result.unwrap() + 1
}

unwrapAndIncrement(Ok.new(0)) // will return 1
unwrapAndIncrement(Err.error("Error"))) // will throw Error("Error")
```

### Optional

Use `ok()` and `err()` to get an Option, and use `inner` to get the inner value if `Some`, or `undefined` if `None`

```typescript
function maybeSlice(result: Result<string>): string | undefined {
  return result.ok().inner?.slice(0, 5)
}

maybeSlice(new Ok("hello world")) // will return "hello"
maybeSlice(Err.error("Error")) // will return undefined 
```

### Safe mapping

You can easily map inner data if Ok and do nothing if Err, with support for async and sync

```typescript
import { Result, Ok, Err } from "@hazae41/result"

function tryIncrement(result: Result<number, Error>): Result<number, Error> {
  return result.mapSync(x => x + 1)
}

tryIncrement(new Ok(0)) // Ok(1)
tryIncrement(Err.error("Error")) // Err(Error("Error"))
```

### Type guards

You can easily check for Ok or Err and it's fully type safe

```typescript
import { Result, Ok, Err } from "@hazae41/result"

function incrementOrFail(result: Result<number, Error>): number | Error {
  if (result.isOk())
    result // Ok<number>
  else
    result // Err<Error>
}
```

### Wrapping

You can easily wrap try-catch patterns, with support for async and sync

```typescript
const result = Result.catchAndWrapSync(() => {
  if (something)
    return 12345
  else
    throw new Error("It failed")
})
```

### Rewrapping

If another library implements its own Result type, as long as it has `unwrap()`, you can rewrap it to this library in one function

```typescript
interface OtherResult<T> {
  unwrap(): T
}

function rewrapAndIncrement(other: OtherResult<number>): Result<number> {
  return Result.rewrap(other).mapSync(x => x + 1)
}
```

### Panicking

When using Result, throwing is seen as "panicking", if something is thrown and is not expected, it should stop the software

So the try-catch pattern is prohibited in Result kingdom, unless you use external code from a library that doesn't use Result

```tsx
try {
  return new Ok(doSomethingThatThrows())
} catch(e: unknown) {
  return new Err(e as Error)
}
```

But, sometimes, you want to do a bunch of actions, unwrap everything, catch everyting and return Err

```tsx
/**
 * BAD EXAMPLE
 **/
try {
  const x = tryDoSomething().unwrap() // lazy unwrap
  const y = tryDoSomething().unwrap() // lazy unwrap
  const z = tryDoSomething().unwrap() // lazy unwrap

  return new Ok(doSomething(x, y, z))
} catch(e: unknown) {
  return new Err(e as Error)
}
```

But what if you only want to catch errors thrown from unwrap(), and not errors coming from real throws

```tsx
/**
 * BAD EXAMPLE
 **/
try {
  const x = tryDoSomething().unwrap()
  const y = tryDoSomething().unwrap()
  const z = tryDoSomething().unwrap()

  return new Ok(doSomethingThatThrows(x, y, z))
} catch(e: unknown) {
  return new Err(e as Error)
}
```

You can do so by using `Err.throw` and `Result.unthrow`

- `Err.throw()` will return `Ok.inner` or throw the `Err` (it will throw `Err` itself, not the inner value), it is similar to `?` in Rust

- `Result.unthrow(callback)` will try-catch `callback`, check if the catched `e` is an instance of `Err` and return it, else it will rethrow `e`

```tsx
return Result.unthrowSync<void, Error>(t => {
  const x = tryDoSomething().throw(t) // will throw Err instead of Err.inner
  const y = tryDoSomething().throw(t) // will throw Err instead of Err.inner
  const z = tryDoSomething().throw(t) // will throw Err instead of Err.inner

  return new Ok(doSomethingThatThrows(x, y, z))
}) // only return Err<Error>, rethrow everything else
```