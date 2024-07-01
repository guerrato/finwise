import { autoInjectable } from 'tsyringe'
import * as sgMail from '@sendgrid/mail'
import { User } from 'models/user.model'
import { encrypt } from 'utils/security'
import { isEmpty, renderTemplate } from 'utils/string'

export interface IEmailProvider {
  sendVerification(user: User): Promise<void>
}

@autoInjectable()
export class EmailProvider implements IEmailProvider {
  async sendVerification(user: User): Promise<void> {
    try {
      if (
        isEmpty(process.env.SENDGRID_FROM_EMAIL) ||
        isEmpty(process.env.SENDGRID_API_KEY) ||
        isEmpty(process.env.FRONTEND_URL)
      ) {
        throw new Error('UTL_VAR_MISSING: Internal Error: Variables missing')
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const { id, name, email } = user

      const token = encrypt(JSON.stringify({ id, email, type: 'verification_token' }))

      const msg: sgMail.MailDataRequired = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Verify Your Email',
        html: renderTemplate(this.getVerificationTemplate(), {
          name,
          verificationUrl: `${process.env.FRONTEND_URL}/verify?token=${token}`,
        }),
      }

      await sgMail.send(msg)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  private getVerificationTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 50px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <tr>
      <td align="center" style="background-color: #007BFF; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">Welcome to FinWise!</h1>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #333333;">Hi <% name %>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333333;">Thank you for signing up for FinWise! Please click the button below to verify your email address and complete your registration.</p>
        <a href="<% verificationUrl %>" style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="font-size: 16px; line-height: 1.6; color: #333333;">If you didn't sign up for FinWise, please ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px; font-size: 12px; color: #777777;">
        <p>© ${new Date().getFullYear().toString()} FinWise. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
}
