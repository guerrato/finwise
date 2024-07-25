import 'reflect-metadata'
import { container } from 'tsyringe'
import { DbProvider } from 'providers/db.provider'
import { EmailProvider, IEmailProvider } from 'providers/email.provider'
import {
  AccountRepository,
  BankRepository,
  IAccountRepository,
  IBankRepository,
  IInflowRepository,
  IUserRepository,
  InflowRepository,
  UserRepository,
} from 'repositories'
import { IUserService, UserService } from 'services/user.service'
import { AccountService, IAccountService } from 'services/account.service'
import { AuthService, IAuthService } from 'services/auth.service'
import { AuthController, IAuthController } from 'controllers/auth.controller'

export const setup = () => {
  // Resolve Singletons
  container.registerSingleton('DbProvider', DbProvider)

  // Providers Injection registrations
  container.register<IEmailProvider>('IEmailProvider', EmailProvider)

  // Repositories Injection registrations
  container.register<IUserRepository>('IUserRepository', UserRepository)
  container.register<IAccountRepository>('IAccountRepository', AccountRepository)
  container.register<IBankRepository>('IBankRepository', BankRepository)
  container.register<IInflowRepository>('IInflowRepository', InflowRepository)

  // Services Injection registrations
  container.register<IUserService>('IUserService', UserService)
  container.register<IAuthService>('IAuthService', AuthService)
  container.register<IAccountService>('IAccountService', AccountService)
  // container.register<IBankService>('IBankService', BankService)
  // container.register<IInflowService>('IInflowService', InflowService)

  container.register<IAuthController>('IAuthController', AuthController)
}
