import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import captchaRouter from './captcha.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRouter, { authRequired } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use('/api/uploads', express.static(process.cwd() + '/uploads', { maxAge: '30d' }));
app.use(cookieParser());
app.use('/api/auth', captchaRouter);
app.use('/api/auth', authRouter);
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.DOUBAO_API_KEY,
  baseURL: process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
app.use('/api/', limiter);

// 如果你用 Node 发静态：
// app.use('/', express.static(path.join(__dirname, '../web')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// 非流式
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], system = 'You are a helpful assistant.' } = req.body || {};
    const all = [{ role: 'system', content: system }, ...messages];
    const model = process.env.DOUBAO_MODEL || 'doubao-pro-32k';

    const r = await client.chat.completions.create({
      model,
      messages: all,
      temperature: 0.7
    });

    res.json({ text: r.choices?.[0]?.message?.content ?? '' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Doubao error' });
  }
});

// 流式（NDJSON）
app.post('/api/chat-stream', async (req, res) => {
  try {
    const { messages = [], system = 'You are a helpful assistant.' } = req.body || {};
    const all = [{ role: 'system', content: system }, ...messages];
    const model = process.env.DOUBAO_MODEL || 'doubao-pro-32k';

    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // for nginx

    const stream = await client.chat.completions.create({
      model,
      messages: all,
      temperature: 0.7,
      stream: true
    });

    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content;
      if (delta) res.write(JSON.stringify({ delta }) + '\n');
    }
    res.write(JSON.stringify({ done: true }) + '\n');
    res.end();
  } catch (err) {
    try { res.write(JSON.stringify({ error: err.message || 'Doubao error' }) + '\n'); } catch {}
    res.end();
  }
});

app.listen(PORT, () => console.log(`API listening on http://0.0.0.0:${PORT}`));

// ---- chat-stream 结束后写入日志（示例函数） ----
import db from './db.js';
import { v4 as uuid } from 'uuid';
function logChat(userId, question, answer, tokensIn = null, tokensOut = null) {
  try {
    const stmt = db.prepare('INSERT INTO chat_logs (id,user_id,question,answer,tokens_in,tokens_out,created_at) VALUES (@id,@user_id,@question,@answer,@tokens_in,@tokens_out,@created_at)');
    stmt.run({ id: uuid(), user_id: userId, question, answer, tokens_in: tokensIn, tokens_out: tokensOut, created_at: Date.now() });
  } catch {}
}
