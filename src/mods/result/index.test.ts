import { assert, test, throws } from "@hazae41/phobos";
import { Err } from "./err.js";
import { Ok } from "./ok.js";
import { Result } from "./result.js";

function doNotRun(result: Result<Result<string, DOMException>, TypeError>): Result<string, DOMException | TypeError> {
  return result.flatten()
}

class CustomError extends Error {
  readonly #class = CustomError

  constructor(x: number) {
    super(`first`)
  }
}

await test("try-catch", async ({ message }) => {

  assert(throws(() => Result.unthrowSync(t => {
    throw new Error()
  })), `Should have not been catched`)

  assert(!throws(() => Result.unthrowSync<Result<void, Error>>(t => {
    new Err(new Error()).throw(t)

    return Ok.void()
  }).ignore()), `Should have been catched`)

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
  const ok = Result.all(okGenerator()).ignore()
  const err = Result.all(errGenerator()).ignore()

  assert(ok.isOkAndSync(inner => JSON.stringify(inner) === JSON.stringify([1, 2, 3, 4])))
  assert(err.isErrAndSync(inner => inner === 3))
})
