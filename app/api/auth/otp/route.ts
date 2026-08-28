import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // Gmail App Password (NOT your regular password)
  },
})

async function sendOtpEmail(toEmail: string, otpCode: string) {
  const mailOptions = {
    from: `"SUPER AI Resume" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: '🔐 Your SUPER Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0c0c0c; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <div style="background: #ccff00; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 800; letter-spacing: -1px;">SUPER</h1>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="color: #999; font-size: 14px; margin: 0 0 24px 0;">Your verification code is:</p>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
            <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #ccff00; letter-spacing: 8px;">${otpCode}</span>
          </div>
          <p style="color: #666; font-size: 13px; margin: 0;">This code expires in <strong style="color: #999;">15 minutes</strong>.</p>
          <p style="color: #444; font-size: 12px; margin: 24px 0 0 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function POST(req: Request) {
  try {
    const { action, email, code, password } = await req.json()

    if (action === 'generate') {
      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        const dummyPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
        user = await prisma.user.create({
          data: {
            email,
            password: dummyPassword
          }
        })
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins expiry

      await prisma.oTP.create({
        data: {
          code: otpCode,
          userId: user.id,
          expiresAt
        }
      })

      // Send real email via Gmail SMTP
      try {
        await sendOtpEmail(email, otpCode)
        console.log(`[EMAIL SENT] OTP sent to ${email}`)
      } catch (emailError) {
        console.error('[EMAIL ERROR]', emailError)
        // Fallback: log to console if email fails
        console.log(`[FALLBACK] OTP for ${email} is: ${otpCode}`)
      }

      return NextResponse.json({ 
        success: true, 
        message: `OTP sent to ${email}. Check your inbox!`
      })
    }

    if (action === 'verify') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      const otpRecord = await prisma.oTP.findFirst({
        where: {
          userId: user.id,
          code: code,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      })

      if (!otpRecord) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
      }

      await prisma.oTP.delete({ where: { id: otpRecord.id } })

      return NextResponse.json({ success: true, message: 'Verified successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
