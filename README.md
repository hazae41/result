# Result

Just a result

```bash
npm i @hazae41/result
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/result)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Rust inspired
- wrap()/unwrap()/rewrap() conversion (async/sync)
- ok()/err() optional chaining
- isOk()/isErr() type guards
- map()/tryMap() type mapping (async/sync)
- Unit-tested

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

Use `ok()` and `err()` to get the inner value or undefined

```typescript
function maybeSlice(result: Result<string>): string | undefined {
  return result.ok()?.slice(0, 5)
}

maybeSlice(Ok.new("hello world")) // will return "hello"
maybeSlice(Err.error("Error")) // will return undefined 
```

### Safe mapping

You can easily map inner data if Ok and do nothing if Err, with support for async and sync

```typescript
import { Result, Ok, Err } from "@hazae41/result"

function tryIncrement(result: Result<number, Error>): Result<number> {
  return result.mapSync(x => x + 1)
}

tryIncrement(Ok.new(0)) // Ok(1)
tryIncrement(Err.error("Error")) // Err(Error("Error"))
```

### Type guards

You can easily check for Ok or Err and it's fully type safe

```typescript
import { Result, Ok, Err } from "@hazae41/result"

function incrementOrFail(result: Result<number, Error>): number | Error {
  if (result.isOk())  // Ok<number>
    return result.inner + 1 // number
  else                // Err<Error>
    return new Error("Failed", { cause: result.inner }) 
}
```

### Wrapping

You can easily wrap try-catch patterns, with support for async and sync

```typescript
const result = Result.tryWrapSync(() => {
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
  return Result.rewrap(other).tryMapSync(x => x + 1)
}
```