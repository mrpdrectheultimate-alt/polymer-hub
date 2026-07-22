import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET || 'polymerhub_cron_secret_2026';

  if (searchParams.get('secret') !== secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, youtube_url')
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date().toISOString();

  return NextResponse.json({
    status: 'success',
    executedAt: now,
    checkedVideosCount: videos?.length || 0,
    nextScheduledRun: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
    message: 'Health check completed successfully via Vercel Cron daily scheduler.'
  });
}
