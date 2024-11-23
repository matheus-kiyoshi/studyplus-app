/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

const proxy = async (token: string) => {
  if (!token) return null

  const response = await api.get('profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 200) {
    return response.data
  }
  return null
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const payload = {
          email: credentials.email,
          password: credentials.password,
        }

        try {
          const response = await api.post('login', payload, {
            params: { useToken: false },
          })
          if (response.status === 200) {
            const user = await proxy(response.data.access_token)
            user.token = response.data.access_token
            console.log('user: ', user)
            return user
          }

          return null
        } catch (error) {
          console.error('Erro ao fazer login:', error)
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: any
      user: any
      account: any
    }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        }
      }

      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      session.user = token.user

      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (
        url === '/api/auth/callback/google' ||
        url === '/api/auth/callback/credentials'
      ) {
        return `${baseUrl}/`
      }

      if (url === '/api/auth/signout') {
        return `${baseUrl}/`
      }

      if (url.startsWith(baseUrl)) {
        return url
      }

      return baseUrl
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
