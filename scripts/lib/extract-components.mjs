// Reads the public components from src/components with the TypeScript compiler:
// name, source file, props (type, optional, default, JSDoc) and the leading comment.
import ts from 'typescript'
import path from 'node:path'
import fs from 'node:fs'

const root = path.resolve(import.meta.dirname, '../..')
const dir = path.join(root, 'src/components')
const SKIP_FILES = new Set(['index.ts', 'shared.ts', 'a11y.ts', 'labels.tsx'])

export function extractComponents() {
  const files = fs.readdirSync(dir).filter((f) => /\.tsx$/.test(f) && !SKIP_FILES.has(f)).map((f) => path.join(dir, f))
  const program = ts.createProgram(files, { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, strict: true, skipLibCheck: true, noEmit: true, types: [], lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'], esModuleInterop: true })
  const checker = program.getTypeChecker()
  const out = []
  for (const sf of program.getSourceFiles()) {
    if (!files.includes(sf.fileName)) continue
    const rel = path.relative(root, sf.fileName)
    for (const st of sf.statements) {
      if (!ts.isFunctionDeclaration(st) || !st.name || !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue
      const name = st.name.text
      if (!/^[A-Z]/.test(name)) continue
      const param = st.parameters[0]
      const defaults = {}
      if (param && ts.isObjectBindingPattern(param.name)) {
        for (const el of param.name.elements) if (el.initializer && ts.isIdentifier(el.name)) defaults[el.name.text] = el.initializer.getText(sf)
      }
      const props = []
      if (param) {
        const type = checker.getTypeAtLocation(param)
        for (const sym of checker.getPropertiesOfType(type)) {
          const decl = sym.valueDeclaration ?? sym.declarations?.[0]
          if (decl && decl.getSourceFile().fileName.includes('node_modules')) continue
          if (decl && /node_modules|typescript\/lib|@types/.test(decl.getSourceFile().fileName)) continue
          const t = checker.typeToString(checker.getTypeOfSymbolAtLocation(sym, st), st, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
          props.push({
            name: sym.getName(),
            type: t.replace(/\s+/g, ' '),
            optional: !!(sym.flags & ts.SymbolFlags.Optional),
            default: defaults[sym.getName()],
            doc: ts.displayPartsToString(sym.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim(),
          })
        }
      }
      const jsdoc = ts.getJSDocCommentsAndTags(st).map((d) => (ts.isJSDoc(d) ? ts.getTextOfJSDocComment(d.comment) ?? '' : '')).join(' ').trim()
      out.push({ name, file: rel, props, doc: jsdoc })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

if (process.argv[1] === import.meta.filename) {
  const c = extractComponents()
  console.log(c.length, 'components')
  for (const x of c) console.log(x.name.padEnd(22), x.file.padEnd(28), x.props.length + ' props')
}
