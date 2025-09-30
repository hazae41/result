const npm = JSON.parse(Deno.readTextFileSync("./package.json"))
const jsr = JSON.parse(Deno.readTextFileSync("./deno.json"))

jsr.version = npm.version

Deno.writeTextFileSync("./deno.json", JSON.stringify(jsr, null, 2))