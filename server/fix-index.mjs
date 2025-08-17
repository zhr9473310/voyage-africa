import fs from 'node:fs';
const p = '/opt/chatgpt-on-aliyun/server/index.js';
let s = fs.readFileSync(p, 'utf8');

/* 注入 import（若没有） */
if (!s.includes("from './captcha.js'")) {
  s = s.replace(/(import[^\n]*express[^\n]*;\n)/,
    `$1import cookieParser from 'cookie-parser';\n` +
    `import authRouter, { authRequired, verifyRequired } from './auth.js';\n` +
    `import captchaRouter from './captcha.js';\n`
  );
}

/* 注入中间件挂载（若没有） */
if (!s.includes("app.use('/api/auth', captchaRouter)")) {
  if (s.includes("app.use(express.json());")) {
    s = s.replace(/app\.use\(express\.json\(\)\);\n/, (m) =>
      m +
      "app.use(cookieParser());\n" +
      "app.use('/api/auth', captchaRouter);\n" +
      "app.use('/api/auth', authRouter);\n"
    );
  } else if (s.includes("const app = express()") || s.includes("express();")) {
    s = s.replace(/const app = express\(\);?\n/, (m) =>
      m +
      "app.use(express.json());\n" +
      "app.use(cookieParser());\n" +
      "app.use('/api/auth', captchaRouter);\n" +
      "app.use('/api/auth', authRouter);\n"
    );
  }
}

fs.writeFileSync(p, s);
console.log('✅ server/index.js patched');
