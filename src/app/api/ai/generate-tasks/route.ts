import { NextResponse } from 'next/server';
import { z } from 'zod';

const TaskSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

const ResponseSchema = z.object({
  tasks: z.array(TaskSchema).min(1).max(30),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectTitle = String(body?.projectTitle ?? '').trim();
    const prompt = String(body?.prompt ?? '').trim();

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json({ error: 'Missing MISTRAL_API_KEY' }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content:
          'Tu es un assistant de gestion de projet. Tu réponds uniquement en JSON valide. Aucun texte avant ou après. Pas de markdown.',
      },
      {
        role: 'user',
        content:
          'Génère des tâches actionnables UNIQUEMENT pour une app existante de gestion de projets/tâches (Abricot). ' +
          'Ne propose pas de setup général (NextAuth/Prisma etc.) si le projet existe déjà.',
      },
      {
        role: 'user',
        content:
          (projectTitle ? `Projet: ${projectTitle}\n` : '') +
          `Demande utilisateur:\n${prompt}\n\n` +
          `Format JSON STRICT: { "tasks": [ { "title": string, "description": string, "status": "TODO"|"IN_PROGRESS"|"DONE", "priority": "LOW"|"MEDIUM"|"HIGH" } ] }\n` +
          `Interdit: champs supplémentaires (pas de dueDate, tags, etc.).`,
      },
    ];

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages,
      }),
    });

    if (!mistralRes.ok) {
      const details = await mistralRes.text();
      return NextResponse.json(
        { error: 'Mistral API error', details },
        { status: mistralRes.status },
      );
    }

    const data = await mistralRes.json();
    const content = data?.choices?.[0]?.message?.content;

    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    const safe = ResponseSchema.parse(parsed);

    return NextResponse.json({ data: safe });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
