import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type LessonPDFData = {
  title: string
  summary: string
  content: string
  order_index: number
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Sign in to download lesson notes.' }, { status: 401 })
    }

    // Check premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, full_name')
      .eq('id', session.user.id)
      .single()

    const isPremium = profile?.subscription_status === 'premium'
    if (!isPremium) {
      return NextResponse.json(
        { error: 'PDF download is a Premium feature. Upgrade for ₹149/month.' },
        { status: 403 }
      )
    }

    // Get lesson
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ error: 'Lesson slug required' }, { status: 400 })
    }

    const { data: lesson } = await supabase
      .from('lessons')
      .select('*, subjects(name, slug)')
      .eq('slug', slug)
      .single()

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const subjects = lesson.subjects as unknown as { name: string; slug: string }
    const subjectName = subjects?.name ?? 'Polymer Engineering'
    const studentName = profile?.full_name ?? 'Student'

    // Generate the PDF content as HTML that will be rendered
    const htmlContent = generateLessonHTML(lesson, subjectName, studentName)

    // Return HTML with PDF-friendly headers
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'X-Lesson-Title': lesson.title,
      },
    })

  } catch (error) {
    const err = error as Error
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── HTML Template for PDF ────────────────────────────────────────────────────

function generateLessonHTML(lesson: LessonPDFData, subjectName: string, studentName: string): string {
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  // Convert markdown to clean HTML for PDF
  let content = lesson.content || ''

  // Tables
  content = content.replace(/(\|.+\|\n)+/g, (table: string) => {
    const rows = table.trim().split('\n')
    const headers = rows[0].split('|').filter(Boolean).map((h: string) => h.trim())
    const bodyRows = rows.slice(2)
    const bodyHtml = bodyRows.map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    }).join('')
    return `<table><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHtml}</tbody></table>`
  })

  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  content = content.replace(/^---$/gm, '<hr>')
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  content = content.replace(/^- (.+)$/gm, '<li>$1</li>')
  content = content.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
  content = content.replace(/^(?!<[a-z]).+$/gm, (line: string) => {
    if (!line.trim()) return ''
    return `<p>${line}</p>`
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lesson.title} — PolymerHub Notes</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #0A0A0A;
      background: white;
      max-width: 720px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Print styles */
    @media print {
      body { padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      h2 { page-break-after: avoid; }
    }

    /* Header */
    .header {
      border-bottom: 4px solid #0A0A0A;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-box {
      width: 32px;
      height: 32px;
      background: #0A0A0A;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-size: 14pt;
      font-weight: 900;
      color: #0A0A0A;
    }

    .header-meta {
      text-align: right;
      font-size: 8pt;
      color: #6B7280;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .subject-tag {
      display: inline-block;
      border: 2px solid #0A0A0A;
      padding: 2px 8px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }

    .lesson-title {
      font-size: 20pt;
      font-weight: 900;
      line-height: 1.2;
      color: #0A0A0A;
      margin-bottom: 8px;
    }

    .lesson-summary {
      font-size: 10pt;
      color: #404040;
      line-height: 1.6;
      padding-left: 12px;
      border-left: 3px solid #1D4ED8;
    }

    /* Content styles */
    h2 {
      font-size: 14pt;
      font-weight: 900;
      color: #0A0A0A;
      margin: 24px 0 10px;
      padding-bottom: 6px;
      border-bottom: 3px solid #0A0A0A;
    }

    h3 {
      font-size: 12pt;
      font-weight: 700;
      color: #0A0A0A;
      margin: 18px 0 8px;
    }

    p {
      margin: 8px 0;
      color: #1A1A1A;
    }

    ul {
      margin: 8px 0 8px 20px;
    }

    li {
      margin: 4px 0;
      color: #1A1A1A;
    }

    strong {
      font-weight: 700;
      color: #0A0A0A;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      background: #F3F4F6;
      border: 1px solid #D1D5DB;
      padding: 1px 4px;
      color: #1D4ED8;
    }

    hr {
      border: none;
      border-top: 2px solid #E5E7EB;
      margin: 20px 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 10pt;
    }

    th {
      background: #0A0A0A;
      color: white;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 7px 10px;
      border-bottom: 1px solid #E5E7EB;
      color: #1A1A1A;
    }

    tr:nth-child(even) td { background: #F9FAFB; }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 3px solid #0A0A0A;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-text {
      font-size: 8pt;
      color: #6B7280;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .watermark {
      font-size: 7pt;
      color: #9CA3AF;
      font-family: 'Courier New', monospace;
      text-transform: uppercase;
    }

    /* Print button */
    .print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0A0A0A;
      color: white;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
    }

    .print-bar-text {
      font-size: 12px;
      font-weight: 700;
    }

    .print-btn {
      background: #FACC15;
      color: #0A0A0A;
      border: none;
      padding: 8px 20px;
      font-weight: 900;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      cursor: pointer;
    }

    .print-btn:hover { background: #EAB308; }

    @media print {
      body { padding-top: 0 !important; }
      .print-bar { display: none; }
    }

    body { padding-top: 56px; }
  </style>
</head>
<body>

  <!-- Print bar (hidden when printing) -->
  <div class="print-bar no-print">
    <span class="print-bar-text">📄 ${lesson.title} — PolymerHub Notes</span>
    <button class="print-btn" onclick="window.print()">⬇ Save as PDF</button>
  </div>

  <!-- Document header -->
  <div class="header">
    <div class="header-top">
      <div class="logo">
        <div class="logo-box">
          <span style="color: #FACC15; font-weight: 900; font-size: 14px;">P</span>
        </div>
        <span class="logo-text">PolymerHub</span>
      </div>
      <div class="header-meta">
        <div>India's PPE Knowledge Platform</div>
        <div>polymer-hub-six.vercel.app</div>
        <div>Downloaded: ${now}</div>
        <div>Student: ${studentName}</div>
      </div>
    </div>
    <div class="subject-tag">${subjectName} · Lesson ${lesson.order_index}</div>
    <h1 class="lesson-title">${lesson.title}</h1>
    <p class="lesson-summary">${lesson.summary}</p>
  </div>

  <!-- Lesson content -->
  <div class="content">
    ${content}
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">
      PolymerHub · ${subjectName} · Lesson ${lesson.order_index}<br>
      polymer-hub-six.vercel.app
    </div>
    <div class="watermark">
      Generated for ${studentName}<br>
      ${now} · Premium Notes
    </div>
  </div>

  <script>
    // Auto-trigger print dialog after fonts load
    window.addEventListener('load', function() {
      // Small delay to ensure fonts are loaded
      setTimeout(function() {
        // Don't auto-print, let user click the button
      }, 500);
    });
  </script>

</body>
</html>`
}
