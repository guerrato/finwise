import { hash, verify as argonVerify } from 'argon2'
import { JwtPayload, sign, verify as jwtVerify } from 'jsonwebtoken'

type PasswordValidation = {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  specialChar: boolean
}

export const generateHash = async (password: string, secretKey: string): Promise<string> => {
  return await hash(password, { secret: Buffer.from(secretKey) })
}

export const verifyHash = async (hash: string, password: string, secretKey: string): Promise<boolean> => {
  return await argonVerify(hash, password, { secret: Buffer.from(secretKey) })
}

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwtVerify(token, secret) as JwtPayload
}

export const createToken = (payload: object, secret: string): string => {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60

  return sign({ ...payload, iat: now, exp }, secret)
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
