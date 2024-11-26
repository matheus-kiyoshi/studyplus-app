/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import axios from 'axios'

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
      async profile(profile, tokens) {
        if (tokens.id_token) {
          try {
            const response = await api.post('google-login', {
              idToken: tokens.id_token,
            })

            const { access_token } = response.data

            const user: any = await api.get('profile', {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            })
            if (!user) throw new Error('Erro ao autenticar usuário com Google') 

            return {
              id: user.id || profile.sub,
              name: profile.name,
              email: profile.email,
              token: access_token,
            }
          } catch (error) {
            console.error('Erro ao obter JWT com id_token do Google:', error)
            throw new Error('Erro ao autenticar usuário com Google')
          }
        }
        return profile
      },
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
    async jwt({ token, user }) {
      if (user) {
        token.user = user
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token?.user) {
        session.user = token.user
      }
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
