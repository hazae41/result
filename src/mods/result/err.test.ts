import { assert, test, throws } from "@hazae41/phobos"
import { Err } from "./err.js"
import { Ok } from "./ok.js"
import { Result } from "./result.js"

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