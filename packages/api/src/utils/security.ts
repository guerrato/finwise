import { hash, verify as argonVerify } from 'argon2'
import { JwtPayload, sign, verify as jwtVerify } from 'jsonwebtoken'
import { isEmpty } from './string'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

type PasswordValidation = {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  specialChar: boolean
}

type TokenPayload = {
  sub: string
  aud: string
}

const algorithm = 'aes-256-cbc'

export const generateHash = async (password: string, secretKey: string): Promise<string> => {
  return await hash(password, { secret: Buffer.from(secretKey) })
}

export const verifyHash = async (hash: string, password: string, secretKey: string): Promise<boolean> => {
  return await argonVerify(hash, password, { secret: Buffer.from(secretKey) })
}

export const verifyToken = (token: string, secret: string): JwtPayload | undefined => {
  try {
    return jwtVerify(token, secret) as JwtPayload
  } catch (error) {
    return undefined
  }
}

export const createToken = (payload: TokenPayload, secret: string): string => {
  if (!process.env.API_DOMAIN) {
    throw new Error('UTL_VAR_MISSING: Internal Error: Variables missing')
  }

  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60

  return sign({ ...payload, iat: now, nbf: now, exp, iss: process.env.AÍPI_DOMAIN }, secret)
}

export const validatePassword = (password: string): PasswordValidation => {
  const validation: PasswordValidation = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }
  return validation
}

export const encrypt = (data: string): string => {
  if (isEmpty(process.env.ENCRYPTION_KEY)) {
    throw new Error('UTL_VAR_MISSING: Internal Error: Variables missing')
  }

  const initialization_vector = randomBytes(16)
  const cipher = createCipheriv(algorithm, Buffer.from(process.env.ENCRYPTION_KEY), initialization_vector)
  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${initialization_vector.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (encryptedData: string): string => {
  if (isEmpty(process.env.ENCRYPTION_KEY)) {
    throw new Error('UTL_VAR_MISSING: Internal Error: Variables missing')
  }

  const textParts = encryptedData.split(':')
  const initialization_vector = Buffer.from(textParts.shift() as string, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), initialization_vector)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
