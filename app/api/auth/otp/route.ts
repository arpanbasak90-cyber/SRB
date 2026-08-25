import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { action, email, code, password } = await req.json()

    if (action === 'generate') {
      // 1. Check if user exists or create them if we want auto-signup on OTP
      // For this implementation, let's assume we create a user if they don't exist
      // or we just send an OTP for verification before setting a password
      let user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        // Create user with a dummy password since they haven't set one yet
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

      // MOCK SENDING EMAIL
      console.log(`[MOCK EMAIL] OTP for ${email} is: ${otpCode}`)

      return NextResponse.json({ success: true, message: 'OTP sent (check console)' })
    }

    if (action === 'verify') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

      const otpRecord = await prisma.oTP.findFirst({
        where: {
          userId: user.id,
          code: code,
          expiresAt: { gt: new Date() } // Not expired
        },
        orderBy: { createdAt: 'desc' }
      })

      if (!otpRecord) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
      }

      // Valid OTP. If password is provided, set it.
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
      }

      // Delete the used OTP
      await prisma.oTP.delete({ where: { id: otpRecord.id } })

      return NextResponse.json({ success: true, message: 'Verified successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
