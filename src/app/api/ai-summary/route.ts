import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, description, topics, stars, language } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Analyze this GitHub repository for DevOps and AI engineers:
Repo: ${fullName}
Description: ${description}
Stars: ${stars}
Language: ${language}
Topics: ${(topics || []).join(', ')}

Return a concise JSON response with this exact structure:
{
  "tagline": "One punchy sentence summarizing what it does",
  "whyUseful": "2-3 sentences explaining why it's critical, what real pain point it solves, and how it compares to alternatives",
  "targetAudience": ["Role 1", "Role 2", "Role 3"],
  "topFeatures": ["Key feature 1", "Key feature 2", "Key feature 3"],
  "architectureFit": "Where this fits into modern DevOps/AI infrastructure stacks"
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (res.ok) {
          const aiData = await res.json();
          const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return NextResponse.json({ success: true, insight: parsed });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to smart heuristics:', geminiError);
      }
    }

    // Smart heuristic analysis fallback
    const isAi = (topics || []).some((t: string) => ['ai', 'llm', 'rag', 'agent', 'model'].includes(t)) ||
                 (description || '').toLowerCase().includes('ai') ||
                 (description || '').toLowerCase().includes('llm');

    const isInfra = (topics || []).some((t: string) => ['kubernetes', 'docker', 'terraform', 'iac', 'gitops'].includes(t));

    const insight = {
      tagline: `${fullName} is a widely-used ${language || 'open-source'} tool with ${stars.toLocaleString()} stars.`,
      whyUseful: isAi 
        ? 'Accelerates modern AI engineering workflows by optimizing inference, agent orchestration, or embedding management with community-proven stability.'
        : isInfra
        ? 'Provides declarative cloud-native infrastructure automation, eliminating manual configuration drift and boosting production reliability.'
        : `Battle-tested by thousands of developers, solving common scalability and automation hurdles in ${language || 'software'} development.`,
      targetAudience: isAi 
        ? ['AI Engineers', 'LLMOps Practitioners', 'Full-Stack Developers']
        : ['DevOps Engineers', 'Platform Architects', 'SREs'],
      topFeatures: (topics || []).slice(0, 4).map((t: string) => t.replace(/-/g, ' ').toUpperCase()),
      architectureFit: isAi
        ? 'Fits into the AI Application / Model Orchestration / Vector Data layer.'
        : 'Fits into the Infrastructure as Code (IaC), CI/CD, and Cluster Management layer.'
    };

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Error in /api/ai-summary:', error);
    return NextResponse.json({ error: 'Failed to generate AI insight' }, { status: 500 });
  }
}
