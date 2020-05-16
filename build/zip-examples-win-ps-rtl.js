#!/usr/bin/env node

/*!
 * Script to create the built examples zip archive;
 * requires the `zip` command to be present!
 * Copyright 2020 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const shell = require('shelljs')
shell.config.fatal = true

if (!shell.test('-d', '_gh_pages')) {
  throw new Error('The "_gh_pages" folder does not exist, did you forget building the docs?')
}

const path = require('path')

// switch to the root dir
shell.cd(path.join(__dirname, '..'))

const {
  version,
  version_short: versionShort,
  'rtl-revision': rtlRevision
} = require('../package.json')

const folderName = `bootstrap-${version}-rtl-examples`

// remove any previously created folder with the same name
shell.rm('-rf', folderName)

// create any folders so that `cp` works
shell.mkdir('-p', folderName)
shell.mkdir('-p', `${folderName}/assets/brand/`)

shell.cp('-Rf', `_gh_pages/docs/${versionShort}/examples/*`, folderName)
shell.cp('-Rf', `_gh_pages/docs/${versionShort}/dist/`, `${folderName}/assets/`)

// also copy the two brand images we use in the examples
shell.cp('-f', [
  `_gh_pages/docs/${versionShort}/assets/brand/bootstrap-outline.svg`,
  `_gh_pages/docs/${versionShort}/assets/brand/bootstrap-solid.svg`
], `${folderName}/assets/brand/`)

shell.rm(`${folderName}/index.html`)

// get all examples' HTML files
shell.find(`${folderName}/**/*.html`).forEach((file) => {
  const fileContents = shell.cat(file)
    .toString()
    .replace(new RegExp(`"/docs/${versionShort}/`, 'g'), '"../')
    .replace(/"..\/dist\//g, '"../assets/dist/')
    .replace(/(<link href="\.\.\/.*) integrity=".*>/g, '$1>')
    .replace(/(<script src="\.\.\/.*) integrity=".*>/g, '$1></script>')
    .replace(/( +)<!-- favicons(.|\n)+<style>/i, '    <style>')
  new shell.ShellString(fileContents).to(file)
})

// create the zip file
const fileName = `bootstrap-${version}-plus-rtl-rev.${rtlRevision}-examples.zip`
const deleteCommand = `PowerShell Remove-Item -Path ${fileName}`
const buildCommand = `PowerShell Compress-Archive -Path "${folderName}" -CompressionLevel Optimal -DestinationPath ${fileName}`

shell.exec(deleteCommand, (code, stdout, stderr) => {
  code = Number(code)
  if (code === 0 || code === 1) {
    shell.exec(buildCommand, (code, stdout, stderr) => {
      code = Number(code)
      if (code === 0) {
        shell.echo('Package build succeeded!')
      } else {
        shell.echo(`Error: ${stderr}`)
        shell.exit(1)
      }

      // remove the folder we created
      shell.rm('-rf', folderName)
    })
  } else {
    shell.echo(`Error: ${stderr}`)
    shell.exit(1)
  }
})

