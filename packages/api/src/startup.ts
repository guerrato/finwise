import 'reflect-metadata'
import { container } from 'tsyringe'
import { DbProvider } from 'providers/db.provider'
import { EmailProvider, IEmailProvider } from 'providers/email.provider'

export const bootstrap = () => {
  // Resolve Singletons
  container.registerSingleton('DbProvider', DbProvider)

  // Providers Injection registrations
  container.register<IEmailProvider>('IEmailProvider', EmailProvider)
}