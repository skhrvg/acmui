import { spawn } from 'node:child_process'
import * as OTPAuth from 'otpauth'
import { setTrayOpacity, win } from './index'

function generateOTP(otpSecret: string): string {
  const totp = OTPAuth.URI.parse(otpSecret) as OTPAuth.TOTP
  return totp.generate()
}

function handleOutput(data: string) {
  const outputs = data.toString().split('\n')
  for (const output of outputs) {
    for (let line of output.split('\n')) {
      if (!line.startsWith('\r  >> '))
        continue
      line = line.replace('\r  >> ', '')
      const [key, value] = line.split(': ', 2)
      if (win)
        win.webContents.send('output', key, value)
      if (key === 'state') {
        if (value.startsWith('Connected'))
          setTrayOpacity(true)
        if (value.startsWith('Disconnected'))
          setTrayOpacity(false)
      }
    }
  }
}

function handleError(data: string) {
  console.error(`stderr: ${data}`)
}

export function disconnectVPN(): Promise<void> {
  return new Promise((resolve) => {
    const disconnect = spawn('/opt/cisco/secureclient/bin/vpn', ['disconnect'])
    disconnect.stdout.on('data', handleOutput)
    disconnect.stderr.on('data', handleError)
    disconnect.on('close', (code, signal) => {
      console.info(`Disconnect executed with code ${code} (${signal})`)
      resolve()
    })
  })
}

export function checkVPN(): Promise<void> {
  return new Promise((resolve) => {
    const check = spawn('/opt/cisco/secureclient/bin/vpn', ['state'])
    check.stdout.on('data', handleOutput)
    check.stderr.on('data', handleError)
    check.on('close', (code, signal) => {
      console.info(`Status executed with code ${code} (${signal})`)
      resolve()
    })
  })
}

export function connectVPN(url: string, username: string, password: string, otpSecret?: string): Promise<void> {
  return new Promise((resolve) => {
    const connect = spawn('/opt/cisco/secureclient/bin/vpn', ['-s', 'connect', url])
    connect.stdin.write(`${username}\n`)
    connect.stdin.write(`${password}\n`)
    if (otpSecret) {
      const otp = generateOTP(otpSecret)
      console.info(`Generated OTP: ${otp}`)
      connect.stdin.write(`${otp}\n`)
    }
    connect.stdin.write('y\n')
    connect.stdin.end()
    connect.stdout.on('data', handleOutput)
    connect.stderr.on('data', handleError)
    connect.on('close', (code, signal) => {
      console.info(`Connect executed with code ${code} (${signal})`)
      resolve()
    })
  })
}
