import 'reflect-metadata'
import { container } from 'tsyringe'
import { DbContext } from 'lib/dbContext'

export const bootstrap = () => {
  // Resolve Singletons
  container.registerSingleton('DbContext', DbContext)
}