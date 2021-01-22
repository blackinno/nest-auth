import { randomBytes } from 'crypto'

export const matchRoles = (roles: string[], userRole: string): boolean => {
  return roles.includes(userRole)
}

export const respValue = (message: string, code = 200) => ({ statusCode: code, message })

export const setTokenAndExpires = (min: number) => {
  const token = randomBytes(20).toString('hex')
  const expiration = new Date()
  expiration.setMinutes(expiration.getMinutes() + min)
  return {
    token,
    expiration,
  }
}
