export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { contents, generationConfig } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;  // Chave server-side (sem VITE_)
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave API não encontrada no server' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Erro na API: ${errorText}` });
    }

    const data = await response.json();
    const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Resposta vazia.';

    res.status(200).json({ content: aiContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
