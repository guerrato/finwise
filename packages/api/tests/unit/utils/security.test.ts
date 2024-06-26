import { generateHash, verifyHash, verifyToken, createToken, validatePassword } from 'utils/security'

describe('Security Utils', () => {
  describe('Password Management', () => {
    test('Should throw error for password with less than 8 length string', async () => {
      const password = 'pass'
      await expect(validatePassword(password)).rejects.toThrow('Password must be at least 8 characters long')
    })
    test('Should throw error for password not meeting special char criteria', async () => {
      const password = 'password'
      await expect(validatePassword(password)).rejects.toThrow('Password must contain at least one special character')
    })
    test('Should throw error for password not meeting uppercase char criteria', async () => {
      const password = 'password'
      await expect(validatePassword(password)).rejects.toThrow('Password must contain at least one uppercase character')
    })
    test('Should throw error for password not meeting lowercase char criteria', async () => {
      const password = 'PASSWORD'
      await expect(validatePassword(password)).rejects.toThrow('Password must contain at least one lowercase character')
    })
    test('Should throw error for password not meeting number char criteria', async () => {
      const password = 'Password'
      await expect(validatePassword(password)).rejects.toThrow('Password must contain at least one number')
    })
  })

  describe('Hash generation', () => {
    test('Should generate a hash for the given password', async () => {
      const password = 'P@ssw0rd'
      const secretKey = 'secret123'
      const hashedPassword = await generateHash(password, secretKey)

      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toEqual(password)
    })
  })

  describe('Hash verification', () => {
    test('Should return true for a valid password and hash', async () => {
      const password = 'password123'
      const secretKey = 'secret123'
      const hashedPassword = await generateHash(password, secretKey)

      const isValid = await verifyHash(hashedPassword, password, secretKey)

      expect(isValid).toBe(true)
    })

    test('Should return false for an invalid password and hash', async () => {
      const password = 'password123'
      const secretKey = 'secret123'
      const hashedPassword = await generateHash(password, secretKey)

      const isValid = await verifyHash(hashedPassword, 'wrongpassword', secretKey)

      expect(isValid).toBe(false)
    })
  })

  describe('JWT Token verification', () => {
    test('should verify a valid token', () => {
      const token = 'valid_token'
      const secret = 'secret_key'

      const result = verifyToken(token, secret)

      expect(result).toBeTruthy()
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('sub')
      expect(result).toHaveProperty('alg')
      expect(result).toHaveProperty('typ')
      expect(result).toHaveProperty('exp')
      expect(result).toHaveProperty('aud')
      expect(result.id).toBe(1)
      expect(result.username).toBe('john.doe')
    })

    test('should throw an error for an invalid token', () => {
      const token = 'invalid_token'
      const secret = 'secret_key'
      expect(() => verifyToken(token, secret).toThrow())

      describe('JWT Token creation', () => {
        test('should create a token with valid payload', () => {
          const payload = { id: 1, username: 'john.doe' }
          const secret = 'secret_key'
          const result = createToken(payload, secret)
          expect(typeof result).toBe('string')
          expect(result).toBeTruthy()
        })
      })
    })
  })
})
