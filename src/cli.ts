#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { convert, ToType } from './index'

const types: ReadonlyArray<ToType> = ['sass', 'scss']

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

console.log('start')
console.log('source: ' + source)
console.log('target: ' + target)
convert(source, target, toType);

process.on("exit", () => {
 console.log('end')
})