import * as React from 'react'

interface EmailTemplateProps {
  firstName: string
  password: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  password,
}) => (
  <div>
    <h1>Olá, {firstName}!</h1>
    <p>Obrigado por se registrar em nosso sistema.</p>
    <p>
      Sua senha gerada é: <strong>{password}</strong>
    </p>
    <p>
      Recomendamos que você altere a senha ao fazer login pela primeira vez.
    </p>
  </div>
)
