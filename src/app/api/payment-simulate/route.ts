import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase environment variables not set' }, { status: 500 })
    }

    // Initialize service role client to bypass RLS and promote user
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Promote user profile to premium
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'premium' })
      .eq('id', userId)
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    // 2. Approve all pending payment requests for this user
    const { error: paymentError } = await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (paymentError) {
      console.error('Warning: Failed to update payment requests:', paymentError.message)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successfully promoted to premium.',
      profile 
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMessage || 'Verification simulation failed' }, { status: 500 })
  }
}
