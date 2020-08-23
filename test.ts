import { ESLint } from 'eslint';
import { readdirSync } from 'fs';
import { argv, cwd, exit } from 'process';
import resolve from 'resolve';
import { onFinish as onTestsCompletion, onFailure as onTestsFailure } from 'tape';

function normalize(input: string) {
  const name = () =>
    input.endsWith('.test.ts') ?
      input :
      input.endsWith('.ts') ?
        `${input.substr(0, input.length - 2)}test.ts` :
        `${input}.test.ts`
  const n = input.startsWith('src/') ? name() : `src/${name()}`
  console.log(n)
  return n
}

(async function () {

  let [, , ...files] = argv
  const all = files.length === 0

  const lsfr = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true })
      .map((e) =>
        e.isDirectory() ?
          lsfr(`${dir}/${e.name}`) :
          e.name.endsWith('.test.ts') ?
            [`${dir}/${e.name}`] :
            null
      )
      .filter((v): v is string[] => v !== null) // erh... wat?!
      .reduce((left, right) => left.concat(right))


  const resolveOptions = { basedir: cwd(), extensions: Object.keys(require.extensions) };
  const esLint = new ESLint({
    overrideConfig: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2020,
        sourceType: "module"
      },
      extends: [
        "plugin:@typescript-eslint/recommended"
      ],
    },
    extensions: ['.ts']
  })
  const test = async (files: string[]) => {
    // run
    onTestsFailure(() => {
      console.log('tests failed')
      exit(1)
    })
    await Promise.all(
      files.map(async file => {
        await require(resolve.sync(`./${file}`, resolveOptions))
      }))

    onTestsCompletion(() => {
      // lint
      esLint.lintFiles(
        files
          .map(file => [file, file.replace('.test', '')])
          .reduce((l, r) => l.concat(r))
      ).then(async result => {
        const formatter = await esLint.loadFormatter('codeframe')
        console.log(formatter.format(result))
      })
    })
  }

  if (all) {
    test(lsfr('src'))
  } else {
    test(files.map(normalize))
  }


})()