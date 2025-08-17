import express from 'express';
import { randomUUID } from 'crypto';
import svgCaptcha from 'svg-captcha';

const store = new Map(); // id -> { ans, exp, purpose }
function norm(s){ return (s||'').toString().trim().toLowerCase(); }
function ttl(){ return parseInt(process.env.CAPTCHA_TTL_MS || '600000', 10); } // 默认10分钟

export const router = express.Router();

// 生成图片验证码
router.get('/captcha', (req,res)=>{
  const { purpose='login' } = req.query;
  const cap = svgCaptcha.create({ noise:3, color:true, width:140, height:48, size:5, ignoreChars:'0OoIl1' });
  const id = randomUUID();
  store.set(id, { ans: norm(cap.text), exp: Date.now() + ttl(), purpose });
  if (process.env.CAPTCHA_DEBUG === '1') {
    console.log('[CAPTCHA] gen', { purpose, id, answer: cap.text });
  }
  const payload = { id, svg: cap.data };
  if (process.env.CAPTCHA_DEBUG === '1' && req.query.debug === '1') {
    payload.answer = norm(cap.text); // 仅调试时返回答案
  }
  res.json(payload);
});

// 滑块（占位保持兼容）
router.get('/slider/new', (req,res)=> res.status(200).json({ id: randomUUID(), width:280, height:160, notchX:80, bg:'' }));

// 校验图片验证码（成功后失效）
export function verifyCaptchaOrThrow(purpose, id, answer){
  const rec = store.get(id);
  if (!rec) throw new Error('验证码已过期，请重试');
  if (Date.now() > rec.exp) { store.delete(id); throw new Error('验证码已过期，请重试'); }
  if (purpose && rec.purpose && purpose !== rec.purpose) throw new Error('验证码无效，请刷新');
  if (norm(answer) !== rec.ans) throw new Error('验证码错误');
  store.delete(id);
  return true;
}

// 兼容导出：滑块校验（当前恒通过）
export function verifySliderOrThrow(){ return true; }

export default router;
