import execa from 'execa'
import path from 'path'
import fs from 'fs'

const IN_DIR = './test'
const OUT_DIR = './test/out'

beforeEach(() => {
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, {recursive: true})
  }
})

describe('sass to scss', () => {
  test('cli', () => {
    const spy = jest.spyOn(console, 'log');
    return execa.node('./dist/cli.js', ['--source', `${IN_DIR}/sass`, '--target', `${OUT_DIR}/scss`]).then((childProcessResult) => {
      expect(childProcessResult.stdout).toBe(`start
source: ${IN_DIR}/sass
target: ${OUT_DIR}/scss
end`)
      expect(childProcessResult.exitCode).toBe(0)

      // sass files will be converted
      expect(fs.existsSync(`${IN_DIR}/sass/style.sass`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/rtl.sass`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/partial/article.sass`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/partial/header.sass`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/colors/white.sass`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/partial/post/actions_desktop.sass`)).toBe(true)

      expect(fs.existsSync(`${OUT_DIR}/scss/style.scss`)).toBe(true)
      expect(fs.existsSync(`${OUT_DIR}/scss/rtl.scss`)).toBe(true)
      expect(fs.existsSync(`${OUT_DIR}/scss/partial/article.scss`)).toBe(true)
      expect(fs.existsSync(`${OUT_DIR}/scss/partial/header.scss`)).toBe(true)
      expect(fs.existsSync(`${OUT_DIR}/scss/colors/white.scss`)).toBe(true)
      expect(fs.existsSync(`${OUT_DIR}/scss/partial/post/actions_desktop.scss`)).toBe(true)

      // non-sass files will not be outputed to target folder
      expect(fs.existsSync(`${IN_DIR}/sass/foo.md`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/bar.css`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/fooBar.ts`)).toBe(true)
      expect(fs.existsSync(`${IN_DIR}/sass/dummy.txt`)).toBe(true)

      expect(fs.existsSync(`${OUT_DIR}/scss/foo.md`)).toBe(false)
      expect(fs.existsSync(`${OUT_DIR}/scss/bar.css`)).toBe(false)
      expect(fs.existsSync(`${OUT_DIR}/scss/fooBar.ts`)).toBe(false)
      expect(fs.existsSync(`${OUT_DIR}/scss/dummy.txt`)).toBe(false)
    })
  })
})
