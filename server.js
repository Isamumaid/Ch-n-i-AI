const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(GEMINI_API_KEY) });
});

app.post('/api/chat', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Máy chủ chưa cấu hình GEMINI_API_KEY.' });
  }
  const { history, systemInstruction } = req.body || {};
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'Lịch sử trò chuyện không hợp lệ.' });
  }

  const contents = history
    .filter(m => ['user', 'model'].includes(m.role) && Array.isArray(m.parts))
    .map(m => ({
      role: m.role,
      parts: m.parts.filter(p => typeof p.text === 'string').map(p => ({ text: p.text }))
    }))
    .filter(m => m.parts.length);

  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Tin nhắn người dùng không hợp lệ.' });
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: typeof systemInstruction === 'string' ? systemInstruction : 'Bạn là trợ lý du lịch hữu ích. Trả lời bằng tiếng Việt.' }]
        },
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.error?.message || `Gemini API trả về HTTP ${response.status}`;
      console.error('Gemini API error:', response.status, detail);
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: `Gemini API lỗi: ${detail}`
      });
    }
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map(p => p.text || '').join('').trim();
    if (!reply) {
      return res.status(502).json({ error: 'Gemini không trả về nội dung. Có thể yêu cầu bị chặn hoặc hết hạn mức.' });
    }
    return res.json({ reply });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ khi gọi Gemini API.' });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Chèn Ơi! AI server listening on port ${PORT}`));
