import { Ok } from "./ok.js";
import { Result } from "./result.js";

export * from "./err.test.js";

function tryVoid() {
  return Ok.void()
}

function doNotRun(result: Result<string, Error>) {
  result.andThenSync(tryVoid).unwrap()
}