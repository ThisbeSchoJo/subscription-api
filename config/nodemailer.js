/**
 * Nodemailer – SMTP transporter for sending reminder emails.
 * Uses Gmail; EMAIL_PASSWORD should be an app password for accountEmail.
 */
import nodemailer from 'nodemailer';

import { EMAIL_PASSWORD } from './env.js'

export const accountEmail = 'thisbeschojo@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  }
})

export default transporter;