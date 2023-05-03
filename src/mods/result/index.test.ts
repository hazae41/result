import { assert, test, throws } from "@hazae41/phobos";
import { Err } from "./err.js";
import { Ok } from "./ok.js";
import { Result } from "./result.js";

function doNotRun(result: Result<string, Error>) {
  result.mapOr("hello", () => "world")
}

class FirstError extends Error {
  name = "first"
}

class SecondError extends Error {
  name = "second"
}

await test("try-catch", async ({ message }) => {

  assert(throws(() => Result.unthrowSync(() => {
    throw new Error()
  }, Error)), `Should have not been catched`)

  assert(!throws(() => Result.unthrowSync(() => {
    new Err(new Error()).throw()

    return Ok.void()
  })), `Should have been catched`)

  assert(!throws(() => Result.unthrowSync(() => {
    new Err(new Error()).throw()

    return Ok.void()
  }, Error, TypeError)), `Should have been catched`)

  assert(throws(() => Result.unthrowSync<void, FirstError | SecondError>(() => {
    new Err(new Error()).throw()

    return Ok.void()
  }, FirstError, SecondError)), `Should have not been catched`)

  console.log(message)
})

function* okGenerator() {
  yield new Ok(1)
  yield new Ok(2)
  yield new Ok(3)
  yield new Ok(4)
}

function* errGenerator() {
  yield new Ok(1)
  yield new Ok(2)
  yield new Err(3)
  yield new Ok(4)
}

await test("iterators", async () => {
  const ok = Result.all(okGenerator())
  const err = Result.all(errGenerator())

  assert(ok.isOkAndSync(inner => JSON.stringify(inner) === JSON.stringify([1, 2, 3, 4])))
  assert(err.isErrAndSync(inner => inner === 3))
})