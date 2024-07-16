import { IUserRepository } from 'repositories/user.repository'
import { autoInjectable, inject } from 'tsyringe'
import { createToken, verifyHash } from 'utils/security'
import { isEmpty } from 'utils/string'

export interface IAuthService {
  login(email: string, password: string, audienceIP: string): Promise<{ token: string } | null>
}

@autoInjectable()
export class AuthService implements IAuthService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}
  async login(email: string, password: string, audienceIP: string) {
    try {
      if (isEmpty(process.env.SECRET_KEY) || isEmpty(process.env.JWT_SECRET)) {
        throw new Error('SRV_VAR_MISSING: Internal Error: Variables missing')
      }

      const user = await this.userRepository.getUserByEmail(email)

      if (user === null) {
        throw new Error('Credentinals Invalid')
      }

      // TODO: Implement verification of verified email and throw error if not verified

      const match = await verifyHash(password, user.password, process.env.SECRET_KEY)

      if (match !== true) {
        throw new Error('Credentinals Invalid')
      }

      const token = createToken({ sub: user.id, aud: audienceIP }, process.env.JWT_SECRET)

      // TODO: Implement refresh token
      
      return { token }
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }      
}
