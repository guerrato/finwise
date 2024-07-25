import { Request, Response, NextFunction } from 'express'
import httpResponse from '../lib/responses'

async function authenticate(req: Request, res: Response, next: NextFunction) {
  // Check if the user is authenticated
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json(httpResponse({ error: 'Unauthenticated' }))
  let decodedToken

  try {
    // decodedToken = await admin.auth().verifyIdToken(token)
  } catch (e) {
    return res.status(401).json(httpResponse({ error: 'Unauthenticated' }))
  }
  req.headers.user = decodedToken.uid

  if (decodedToken) {
    // User is authenticated
    return next()
  }

  return res.status(401).json(httpResponse({ error: 'Unauthenticated' }))
}

export default authenticate
