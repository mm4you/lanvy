export async function getAIChatCompletion({
  systemPrompt,
  userPrompt,
  messages = [],
  temperature = 0.7,
  maxTokens = 800,
}: {
  systemPrompt: string;
  userPrompt: string;
  messages?: any[];
  temperature?: number;
  maxTokens?: number;
}) {
  const groqKey = process.env.GROQ_API_KEY;
  const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: userPrompt }
  ];

  // 1. Try Groq first with a fast 4.5s timeout
  if (groqKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: fullMessages,
          temperature,
          max_tokens: maxTokens
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errorText = await response.text();
        console.warn(`Groq request failed: ${response.status} - ${errorText}`);
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error('Groq error, switching to Nvidia NIM fallback...', e?.message || e);
    }
  }

  // 2. Fallback to NVIDIA NIM with a fast 4.5s timeout
  if (nvidiaKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          messages: fullMessages,
          temperature,
          max_tokens: maxTokens
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } else {
        const errorText = await response.text();
        console.warn(`Nvidia NIM error: ${response.status} - ${errorText}`);
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error('Nvidia NIM error:', e?.message || e);
    }
  }

  throw new Error('AI service is currently busy or API keys are unconfigured.');
}
