import { NextResponse } from 'next/server';

export interface AnalysisResponse {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  roastPoints: string[];
  strengths: string[];
  rewrittenBullets: {
    original: string;
    improved: string;
    reason: string;
  }[];
  isMock?: boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText } = body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 40) {
      return NextResponse.json(
        { error: 'Please paste a valid resume containing at least 40 characters.' },
        { status: 400 }
      );
    }

    if (resumeText.length > 15000) {
      return NextResponse.json(
        { error: 'Resume text exceeds maximum allowed length of 15,000 characters.' },
        { status: 400 }
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are an expert executive tech recruiter and resume reviewer known for high standards, constructive critiques, and witty roasts.
Analyze the following resume text carefully and return ONLY a valid JSON object matching this exact schema, with no markdown formatting or extra text outside the JSON:

{
  "score": number (0 to 100 based on impact, action verbs, metrics, formatting, clarity),
  "grade": string ("S" | "A" | "B" | "C" | "D" | "F"),
  "summary": string (2-3 sentences overall summary),
  "roastPoints": array of strings (3 to 5 witty, sharp, constructive critique bullet points calling out weak phrases, buzzwords, missing metrics, or passive tone),
  "strengths": array of strings (2 to 3 genuine highlights/strengths in the resume),
  "rewrittenBullets": array of 3 to 5 objects with format {"original": string, "improved": string, "reason": string} (taking weak bullets from the text and converting them into high-impact, quantified STAR method bullets)
}

Resume Text:
"""
${resumeText}
"""`;

    // 1. Anthropic Claude API Integration
    if (anthropicKey) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.content?.[0]?.text || '';
          const parsed = parseAIResponse(content);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error('Claude API call error:', err);
      }
    }

    // 2. OpenAI API Integration
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: 'You reply exclusively in JSON.' },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          const parsed = parseAIResponse(content);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error('OpenAI API call error:', err);
      }
    }

    // 3. Gemini API Integration
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = parseAIResponse(content);
          if (parsed) return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error('Gemini API call error:', err);
      }
    }

    // 4. Fallback Mock Generator (Used during local testing when no API key is provided)
    const mockResult = generateMockAnalysis(resumeText);
    return NextResponse.json(mockResult);

  } catch (error: any) {
    console.error('Analysis route error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while analyzing the resume.' },
      { status: 500 }
    );
  }
}

function parseAIResponse(rawText: string): AnalysisResponse | null {
  try {
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleaned);
    if (typeof data.score === 'number' && Array.isArray(data.roastPoints)) {
      return data;
    }
  } catch (e) {
    console.error('Failed to parse AI JSON:', e);
  }
  return null;
}

function generateMockAnalysis(text: string): AnalysisResponse {
  const charLength = text.length;
  const wordCount = text.trim().split(/\s+/).length;
  
  // Calculate pseudo-realistic score based on text indicators
  const hasNumbers = /\d+%|\$\d+|\d+\s*users/i.test(text);
  const hasActionVerbs = /spearheaded|architected|increased|developed|engineered|optimized|reduced/i.test(text);
  const isShort = wordCount < 100;

  let baseScore = 65;
  if (hasNumbers) baseScore += 12;
  if (hasActionVerbs) baseScore += 10;
  if (isShort) baseScore -= 15;

  const score = Math.max(35, Math.min(92, baseScore));
  const grade = score >= 85 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : 'D';

  return {
    score,
    grade,
    summary: `Your resume currently sits at ${score}/100. It shows core potential, but lacks hard metrics, quantifiable business impact, and strong action verbs to stand out to modern ATS scanners and recruiters.`,
    roastPoints: [
      "You used vague phrases like 'Responsible for' instead of bold action verbs like 'Engineered' or 'Architected'.",
      "Where are the numbers? Recruiters want to see 'Increased conversion by 34%', not just 'Improved website performance'.",
      "Your bullet points read more like a passive job description than an impressive accomplishment showcase.",
      isShort 
        ? "This resume snippet is dangerously brief—recruiters might think you ran out of things to flex!"
        : "Some bullet points are wordy walls of text without clear punchlines."
    ],
    strengths: [
      "Clear chronological layout structure identified.",
      "Good foundational tech stack mention.",
      "Direct focus on key industry role skills."
    ],
    rewrittenBullets: [
      {
        original: "Responsible for managing team tasks and updating website features.",
        improved: "Orchestrated sprint deliverables for a team of 5 engineers, boosting feature deployment velocity by 28%.",
        reason: "Replaced passive 'Responsible for' with active verb 'Orchestrated' and added quantitative impact."
      },
      {
        original: "Worked on fixing bugs and improving database response time.",
        improved: "Optimized PostgreSQL queries and indexing schemas, reducing API latency from 450ms to 120ms.",
        reason: "Added specific database technologies and explicit before/after performance metrics."
      },
      {
        original: "Helped design user interfaces for client web apps.",
        improved: "Spearheaded design system UI components in React, elevating user adoption rates by 40% across 3 client projects.",
        reason: "Elevated 'Helped design' to leadership language ('Spearheaded') and quantified adoption."
      }
    ],
    isMock: true
  };
}
