// Build zipped distribution package by Windows PowerShell

'use strict'

const shell = require('shelljs')
const packageJson = require('../package.json')
const fileName = `bootstrap-${packageJson.version}-dist.zip`
const deleteCommand = `PowerShell Remove-Item -Path ${fileName}`
const buildCommand = `PowerShell Compress-Archive -Path dist/* -CompressionLevel Optimal -DestinationPath ${fileName}`

shell.exec(deleteCommand, (code, stdout, stderr) => {
  if (code == 0 || code == 1) {
    shell.exec(buildCommand, (code, stdout, stderr) => {
      if (code == 0) {
        shell.echo('Package build succeeded!')
      } else {
        shell.echo(`Error: ${stderr}`)
        shell.exit(1)
      }
    })    
  } else {
    shell.echo(`Error: ${stderr}`)
    shell.exit(1)
  }
})