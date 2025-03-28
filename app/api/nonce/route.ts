import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const nonce = crypto.randomUUID()
  
  // Store nonce in cookies for verification
  cookies().set('siwe', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 // 1 hour
  })

  return NextResponse.json({ nonce })
} 