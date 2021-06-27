#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { convertSassToScss } from "./util/convertSassToScss";
import { convertScssToSass } from './util/convertScssToSass';

type ToType = 'sass' | 'scss'
interface Arguments {
    [x: string]: unknown;
    source: string,
    target: string,
    toType: ToType
}
const types: ReadonlyArray<ToType> = ['sass', 'scss']

function convert(dir: string, outDir: string) {
    console.log('outDir: ' + outDir)
    if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    fs.readdirSync(dir).forEach(sub => {
        console.log('sub: ' + sub);

        const subPath = path.resolve(dir, sub);
        if (fs.statSync(subPath).isFile()) {
            if (!sourceFileTypeChecker(sub)) return;

            console.log('subPath: ' + subPath)
            const file = fs.readFileSync(subPath)
            converter(file.toString()).then(scss => {
                const subOutPath = path.resolve(outDir, sub.substring(0, sub.lastIndexOf('.')) + '.scss');

                console.log('writing file to: ' + subOutPath)
                fs.writeFileSync(subOutPath, scss, { flag: 'wx' })
                console.log('writing file done')
            }).catch(e => {
                console.log('error from file: ' + subPath);
                console.log(e)
            })
        }
        else if (fs.statSync(subPath).isDirectory()) {
            const subOutDir = path.resolve(outDir, sub)
            console.log('into subFolder: ' + subPath)
            convert(subPath, subOutDir)
        }
    })
}

function isSassFile(fileName: string) {
    return path.extname(fileName).toLowerCase() == '.sass'
}

function isScssFile(fileName: string) {
    return path.extname(fileName).toLowerCase() == '.scss'
}

/**
 * convert between Sass and SCSS
 */

const argv =
    yargs(hideBin(process.argv))
    .options({
        source: { type: 'string', demandOption: true },
        target: { type: 'string', demandOption: true },
        toType: { choices: types }
    })
    .parseSync();


const source: string = argv.source
const target: string = argv.target
const toType: ToType = argv.toType || 'scss'


const sourceFileTypeChecker = (toType == 'scss' ? isSassFile : isScssFile )
const converter = (toType == 'scss' ? convertSassToScss : convertScssToSass)

console.log('start')
console.log('source: ' + source)
console.log('target: ' + target)
convert(source, target);

process.on("exit", () => {
    console.log('end')
})