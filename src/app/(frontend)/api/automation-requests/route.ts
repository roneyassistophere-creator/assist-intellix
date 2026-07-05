import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  const tool = typeof body?.tool === 'string' ? body.tool.trim() : ''
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
  const wantsPlan = body?.wantsPlan === true
  const attachments = Array.isArray(body?.attachments)
    ? body.attachments.filter((a: unknown): a is string => typeof a === 'string' && a.trim() !== '')
    : []

  if (!name || !prompt || !tool || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Please fill in all required fields with a valid email.' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const doc = await payload.create({
      collection: 'automation-requests',
      data: {
        name,
        email,
        phone: phone || undefined,
        prompt,
        tool,
        wantsPlan,
        attachments: attachments.length > 0 ? attachments.join(', ') : undefined,
        status: 'new',
      },
    })

    return NextResponse.json({ success: true, id: doc.id }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again later.' },
      { status: 500 },
    )
  }
}
