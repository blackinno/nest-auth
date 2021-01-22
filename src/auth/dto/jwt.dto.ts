export class JWT {
  readonly email: string
  readonly sub: {
    id: string
    name: string
    role: string
    createdAt: Date
    updatedAt: Date
  }
}
