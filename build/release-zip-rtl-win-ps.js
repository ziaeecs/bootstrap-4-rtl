// Build zipped distribution package by Windows PowerShell

'use strict'

const shell = require('shelljs')
const packageJson = require('../package.json')
const cmd = `powershell compress-archive -Path dist/* -CompressionLevel Optimal -DestinationPath bootstrap-${packageJson.version}-plus-rtl-rev.${packageJson['rtl-revision']}-dist.zip`

if (shell.exec(cmd).code !== 0) {
  shell.echo('Error: Compression Failed!')
  shell.exit(1)
}
