import { assert, test, throws } from "@hazae41/phobos"
import { Err } from "./err.js"

await test("try-catch", async ({ message }) => {
  assert(throws(() => {
    try {
      throw new Error()
    } catch (e: unknown) {
      return Err.catch(e, Error)
    }
  }), `Should have not been catched`)

  assert(!throws(() => {
    try {
      new Err(new Error()).throw()
    } catch (e: unknown) {
      return Err.catch(e, Error)
    }
  }), `Should have been catched`)

  assert(throws(() => {
    try {
      new Err(new Error()).throw()
    } catch (e: unknown) {
      return Err.catch(e, DOMException)
    }
  }), `Should have not been catched`)

  console.log(message)
})