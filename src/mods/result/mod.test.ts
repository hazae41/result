// deno-lint-ignore-file
import { Err, Ok, Result } from "@/mods/result/mod.ts";
import { assert, test, throws } from "jsr:@hazae41/phobos";

function get(result: Result<string, never>) {
  if (result.isOk())
    return result.get()
  if (result.isErr())
    return result.get()
}

class CustomError extends Error {
  readonly #class = CustomError

  constructor(x: number) {
    super(`first`)
  }
}

test("try-catch", async ({ name }) => {

  assert(throws(() => Result.unthrowSync(t => {
    throw new Error()
  })), `Should have not been catched`)

  assert(!throws(() => Result.unthrowSync<Result<void, Error>>(t => {
    new Err(new Error()).throw(t)

    return Ok.void()
  })), `Should have been catched`)

  console.log(name)
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

test("iterators", async () => {
  const ok = Result.all(okGenerator())
  const err = Result.all(errGenerator())

  assert(ok.isOkAndSync(inner => JSON.stringify(inner) === JSON.stringify([1, 2, 3, 4])))
  assert(err.isErrAndSync(inner => inner === 3))
})