const npm = JSON.parse(Deno.readTextFileSync("./package.json"))
const jsr = JSON.parse(Deno.readTextFileSync("./deno.json"))

if (npm.dependencies)
  for (const name in npm.dependencies)
    if (name.startsWith("@hazae41"))
      jsr.imports[name] = `jsr:${name}@${npm.dependencies[name]}`

if (npm.devDependencies)
  for (const name in npm.devDependencies)
    if (name.startsWith("@hazae41"))
      jsr.imports[name] = `jsr:${name}@${npm.devDependencies[name]}`

if (npm.peerDependencies)
  for (const name in npm.peerDependencies)
    if (name.startsWith("@hazae41"))
      jsr.imports[name] = `jsr:${name}@${npm.peerDependencies[name]}`

jsr.imports = Object.fromEntries(Object.entries(jsr.imports).sort())

Deno.writeTextFileSync("./deno.json", JSON.stringify(jsr, null, 2))