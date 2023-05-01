import { assert, test, throws } from "@hazae41/phobos"
import { Err } from "./err.js"
import { Ok } from "./ok.js"
import { Result } from "./result.js"

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

  assert(throws(() => Result.unthrowSync(() => {
    new Err(new Error()).throw()

    return Ok.void()
  }, DOMException, TypeError)), `Should have not been catched`)

  console.log(message)
})