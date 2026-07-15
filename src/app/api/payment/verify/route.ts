import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification params' }, { status: 400 })
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Calculate subscription end date (1 month from now)
    const now = new Date()
    const subscriptionEnd = new Date(now)
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

    // Upgrade user to premium
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_end_date: subscriptionEnd.toISOString(),
        razorpay_payment_id,
        razorpay_order_id,
        updated_at: now.toISOString(),
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 })
    }

    // Log payment in payment_history table
    const { error: historyError } = await supabase.from('payment_history').insert({
      user_id: session.user.id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: 149,
      currency: 'INR',
      status: 'success',
      plan: 'premium_monthly',
      paid_at: now.toISOString(),
    })

    if (historyError) {
      console.error('Payment history logging error:', historyError)
      // We don't block the response since premium was successfully activated on the profile
    }

    return NextResponse.json({ success: true, message: 'Premium activated successfully' })

  } catch (error: unknown) {
    console.error('Verify payment error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
