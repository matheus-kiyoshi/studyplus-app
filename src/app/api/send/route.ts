import { EmailTemplate } from '@/components/email-template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordEmail(email: string, password: string) {
  const emailContent = EmailTemplate({
    firstName: email.split('@')[0],
    password: password,
  })

  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Sua nova senha',
      react: emailContent,
    })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
  }
}
