import { Ok } from "./ok.js";
import { Result } from "./result.js";

export * from "./err.test.js";

function tryVoid() {
  return Ok.void()
}

function doNotRun(result: Result<string, Error>) {
  const result2 = result.unwrapOrElseSync(e => e.message)
}