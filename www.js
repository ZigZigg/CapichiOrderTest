const { spawn } = require('child_process')
const config = require('./config')

const ls = spawn(`yarn`, ['deploy', `${config.s3Url}`])

ls.stdout.on('data', data => {
  console.log(`${data.toString()}`)
})

ls.stderr.on('data', data => {
  console.log(`${data.toString()}`)
})

ls.on('exit', code => {
  console.log(`${code.toString()}`)
})
