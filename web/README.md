# ZHR · Chat (React + Vite)

前端使用 React/Vite/Tailwind，调用后端的 `/api/chat` 与 `/api/chat-stream`。默认 dev 代理到 `http://127.0.0.1:3000`。

## 开发
```bash
npm i
npm run dev
# 打开 http://localhost:5173
```

## 构建
```bash
npm run build
# 产物在 dist/
```

## 部署到你的阿里云（两种方式）

**方式 A：让 Nginx 指向本项目 dist**
```bash
# 在服务器上（建议把代码放 /opt/chatgpt-on-aliyun/react-app）
npm i && npm run build
# 修改你的 nginx 站点：
#   root /opt/chatgpt-on-aliyun/react-app/dist;
sudo nginx -t && sudo systemctl reload nginx
```

**方式 B：构建后覆盖现有静态目录**
```bash
npm i && npm run build
sudo rsync -av --delete dist/ /opt/chatgpt-on-aliyun/web/
sudo nginx -t && sudo systemctl reload nginx
```

## 注意
- 后端若强制使用环境变量中的模型（推荐），则前端下拉选择仅作 UI；
- 流式输出依赖反向代理：确保 nginx 的 `/api/` location 内有
  ```nginx
  proxy_buffering off;
  add_header X-Accel-Buffering no;
  ```
