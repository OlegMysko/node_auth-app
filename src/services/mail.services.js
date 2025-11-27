
import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function send({ email, subject, html })
{
  return transporter.sendMail({
    to: email,
    subject: subject,
    html: html,
  })
}

function sendActivationEmail(email, token) {
  const href = `${process.env.CLIENT_HOST}/activate/${encodeURIComponent(email)}/${token}`
  const html = `< h1 > ActivateAcount</h1>
      <a href= '${href}'>${href} </a>`
  return send({
    email,
    html, subject: 'activate'
  })
 }
console.log('email send')

export const emailServices = {send, sendActivationEmail}
