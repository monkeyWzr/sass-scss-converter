import fs from 'fs'
import path from 'path'

import { convertSassToScss } from "./util/convertSassToScss";
import { convertScssToSass } from './util/convertScssToSass';

export type ToType = 'sass' | 'scss'
export interface Arguments {
  [x: string]: unknown;
  source: string,
  target: string,
  toType: ToType
}

export function convert(dir: string, outDir: string, toType: ToType) {
  const sourceFileTypeChecker = (toType == 'scss' ? isSassFile : isScssFile)
  const converter = (toType == 'scss' ? convertSassToScss : convertScssToSass)
  convertToTarget(dir, outDir, sourceFileTypeChecker, converter)
}

function convertToTarget(dir: string, outDir: string,
  sourceFileTypeChecker: (name: string) => boolean,
  converter: (name: string) => Promise<string>) {

  // console.log('outDir: ' + outDir)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.readdirSync(dir).forEach(sub => {
    // console.log('sub: ' + sub);

    const subPath = path.resolve(dir, sub);
    if (fs.statSync(subPath).isFile()) {
      if (!sourceFileTypeChecker(sub)) return;

      // console.log('subPath: ' + subPath)
      const file = fs.readFileSync(subPath)
      converter(file.toString()).then(scss => {
        const subOutPath = path.resolve(outDir, sub.substring(0, sub.lastIndexOf('.')) + '.scss');

        // console.log('writing file to: ' + subOutPath)
        fs.writeFileSync(subOutPath, scss, { flag: 'wx' })
        // console.log('writing file done')
      }).catch(e => {
        console.log('error from file: ' + subPath);
        console.log(e)
      })
    }
    else if (fs.statSync(subPath).isDirectory()) {
      const subOutDir = path.resolve(outDir, sub)
      // console.log('into subFolder: ' + subPath)
      convertToTarget(subPath, subOutDir, sourceFileTypeChecker, converter)
    }
  })
}

function isSassFile(fileName: string) {
  return path.extname(fileName).toLowerCase() == '.sass'
}

function isScssFile(fileName: string) {
  return path.extname(fileName).toLowerCase() == '.scss'
}
