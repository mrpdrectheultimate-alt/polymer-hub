/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/chat/route.ts
// PolymerHub AI Tutor — Gemini-powered RAG endpoint
// Embeds the user query, retrieves relevant lesson chunks via pgvector,
// then sends context + question to Gemini for a grounded answer.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// Use 'gemini-embedding-001' as 'text-embedding-004' is deprecated/retired.
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const FREE_DAILY_QUERY_LIMIT = 15

const SYSTEM_PROMPT = `You are PolymerHub AI, an expert in plastic polymer engineering tailored for Indian B.Tech students. Answer only from the provided lesson context. If the answer isn't in the context, say so and suggest the most relevant lesson. Always include a real-world example from the Indian plastics industry (Reliance, Supreme Industries, Astral, CIPET, etc.) where possible. Keep answers clear, concise, and exam-friendly.`

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // 1. Auth check
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Please sign in to use the AI tutor.' },
        { status: 401 }
      )
    }

    const { question } = await request.json()

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 })
    }

    // 2. Fetch profile, check + enforce free tier query limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, queries_used, queries_reset_at')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }

    // Reset daily counter if more than 24h have passed
    const resetAt = new Date(profile.queries_reset_at)
    const hoursSinceReset = (Date.now() - resetAt.getTime()) / (1000 * 60 * 60)
    let queriesUsed = profile.queries_used

    if (hoursSinceReset >= 24) {
      queriesUsed = 0
      await supabase
        .from('profiles')
        .update({ queries_used: 0, queries_reset_at: new Date().toISOString() })
        .eq('id', session.user.id)
    }

    const isPremium = profile.subscription_status === 'premium'

    if (!isPremium && queriesUsed >= FREE_DAILY_QUERY_LIMIT) {
      return NextResponse.json(
        {
          error: 'daily_limit_reached',
          message: `You've used all ${FREE_DAILY_QUERY_LIMIT} free queries today. Upgrade to Premium for unlimited AI tutor access.`,
        },
        { status: 429 }
      )
    }

    // 3. Embed the user's question (Gemini gemini-embedding-001, 768-dim)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedResult = await embeddingModel.embedContent({
      content: { role: 'user', parts: [{ text: question }] },
      outputDimensionality: 768,
    } as any)
    const queryEmbedding = embedResult.embedding.values

    // 4. Vector search via pgvector match function
    const { data: matches, error: matchError } = await supabase.rpc(
      'match_lesson_chunks',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.65,
        match_count: 4,
      }
    )

    if (matchError) {
      console.error('match_lesson_chunks error:', matchError)
      return NextResponse.json(
        { error: 'Search failed. Please try again.' },
        { status: 500 }
      )
    }

    // 5. Build context from retrieved chunks
    const hasContext = matches && matches.length > 0
    const typedMatches = (matches || []) as Array<{ id: string; lesson_id: string; chunk_text: string; similarity: number }>

    const contextBlock = hasContext
      ? typedMatches
          .map((m, i: number) => `[Source ${i + 1}]\n${m.chunk_text}`)
          .join('\n\n---\n\n')
      : 'No directly relevant lesson content was found for this question.'

    // 6. Call Gemini for the final grounded answer
    const fullPrompt = `${SYSTEM_PROMPT}

LESSON CONTEXT:
${contextBlock}

STUDENT QUESTION:
${question}

Answer the question using the lesson context above. If the context doesn't contain the answer, say so clearly and suggest the student check a related subject page.`

    const chatResult = await chatModel.generateContent(fullPrompt)
    const answer = chatResult.response.text()

    // 7. Increment query usage (free users only)
    if (!isPremium) {
      await supabase
        .from('profiles')
        .update({ queries_used: queriesUsed + 1 })
        .eq('id', session.user.id)
    }

    // 8. Get lesson titles/slugs for cited sources (for UI display)
    let sourceLessons: { title: string; slug: string }[] = []
    if (hasContext) {
      const lessonIds = Array.from(new Set(typedMatches.map(m => m.lesson_id)))
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('title, slug')
        .in('id', lessonIds)
      sourceLessons = lessonsData ?? []
    }

    return NextResponse.json({
      answer,
      sources: sourceLessons,
      queriesUsed: isPremium ? null : queriesUsed + 1,
      queriesLimit: isPremium ? null : FREE_DAILY_QUERY_LIMIT,
    })
  } catch (err: unknown) {
    console.error('AI tutor error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
