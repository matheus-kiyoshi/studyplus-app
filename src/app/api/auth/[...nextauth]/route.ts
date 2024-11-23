/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/api'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
/*import Google from 'next-auth/providers/google'
import crypto from 'crypto'
import { sendPasswordEmail } from '../../send/route'
import axios from 'axios'
import { jwtGen } from '@/utils/jsonwebtokengen'*/

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
    /*Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),*/
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
        /*if (account.provider === 'google' && user.email) {
          const response = await api.get(`user/search/${user.email}`)
          if (response.data.statusCode === 404) {
            try {
              const password = crypto.randomBytes(8).toString('hex')

              const response = await api.post('user', {
                name: user.name,
                email: user.email,
                password: password,
              })
              if (response.status === 201) {
                await sendPasswordEmail(user.email, password)
              }
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error(
                  'Erro ao registrar usuário:',
                  error.response?.data || error.message,
                )
                if (error.response) {
                  console.log('Mensagem de erro:', error.response.data.message)
                }
              } else {
                console.error('Erro desconhecido:', error)
              }
            }
          }
        }
        */

        return {
          ...token,
          user: user,
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
