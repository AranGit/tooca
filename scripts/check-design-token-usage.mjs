import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = new URL('../src/', import.meta.url)
const colorLiteral = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(|\b(?:color|background|border-color)\s*:\s*(?:white|black)\b/g
const radiusLiteral = /border-radius\s*:\s*\d+(?:\.\d+)?px\b/g

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    if (!/\.(?:css|ts|tsx)$/.test(path) || /(?:generated-[^/]+|\.stories|\.test)\./.test(path)) return []
    return [path]
  }))
  return nested.flat()
}

const violations = []
for (const file of await sourceFiles(root.pathname)) {
  const content = await readFile(file, 'utf8')
  for (const [rule, expression] of [['color', colorLiteral], ['radius', radiusLiteral]]) {
    for (const match of content.matchAll(expression)) {
      const line = content.slice(0, match.index).split('\n').length
      violations.push(`${relative(root.pathname, file)}:${line}: raw ${rule} ${match[0]}`)
    }
  }
}

if (violations.length) {
  console.error(violations.join('\n'))
  process.exitCode = 1
} else {
  console.log('Application colors and corner radii use design tokens.')
}
