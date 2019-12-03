import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('fails when no token is supplied', () => {
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  expect(() => {
    cp.execSync(`node ${ip}`, options).toString()
  }).toThrow()
})

test('fails when no query is supplied', () => {
  process.env['INPUT_TOKEN'] = 'foobarbaz'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  expect(() => {
    cp.execSync(`node ${ip}`, options).toString()
  }).toThrow()
})
