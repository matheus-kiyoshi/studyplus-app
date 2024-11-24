// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      token?: string
    }
  }

  interface User {
    name?: string
    email?: string
    image?: string
    token?: string
  }
}
