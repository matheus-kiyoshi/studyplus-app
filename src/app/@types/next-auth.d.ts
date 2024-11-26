// types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string 
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
