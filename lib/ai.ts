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
  if (!process.env.GROQ_API_KEY || !process.env.NVIDIA_NIM_API_KEY) {
    try {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach((line: string) => {
          const [k, ...v] = line.split('=');
          if (k && v.length) {
            const keyName = k.trim();
            if (!process.env[keyName]) {
              process.env[keyName] = v.join('=').trim().replace(/^["']|["']$/g, '');
            }
          }
        });
      }
    } catch (e) {
      // Ignore env read error
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: userPrompt }
  ];

  // 0. OpenAI API ONLY for Terminal Bot (IS_TERMINAL_BOT = 'true')
  const isTerminalBot = process.env.IS_TERMINAL_BOT === 'true';
  if (openaiKey && isTerminalBot) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: fullMessages,
          temperature,
          max_tokens: maxTokens
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e: any) {
      // Quiet fail to fallback
    }
  }

  // 1. Groq API
  if (groqKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
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
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
    }
  }

  // 2. Fallback to NVIDIA NIM with auto-retry on timeout
  if (nvidiaKey) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
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
        }
      } catch (e: any) {
        clearTimeout(timeoutId);
      }
    }
  }

  throw new Error('Hệ thống AI dự phòng đang bận, tự động thử lại...');
}
