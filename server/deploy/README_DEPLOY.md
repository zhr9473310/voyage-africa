# ChatGPT on Aliyun — 部署手册

目标：在你的阿里云 ECS 上自托管一个前后端分离的 ChatGPT 网页，后端调用 OpenAI Responses API。

---
## 1. 准备环境（Ubuntu 20.04/22.04）
```bash
# 1) 基础工具
sudo apt update && sudo apt install -y nginx git curl

# 2) 安装 Node.js 20 LTS（推荐用 nvm）
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v && npm -v

# 3) 上传我给你的 zip 到 /opt，并解压
sudo mkdir -p /opt && sudo chown $USER:$USER /opt
unzip chatgpt-on-aliyun.zip -d /opt
mv /opt/chatgpt-on-aliyun /opt/chatgpt-on-aliyun
```

## 2. 配置后端
```bash
cd /opt/chatgpt-on-aliyun
cp server/.env.example server/.env
# 编辑 server/.env，填入你的 OPENAI_API_KEY；或改用 systemd 环境变量
nano server/.env

npm i
# 先本地试跑（前端会从 /web 提供）
node server/index.js
# 浏览器访问 http://服务器IP:3000 看是否能打开网页
```

## 3. 配置 Nginx 反向代理 + SSL
```bash
# 把前端静态文件放到 /var/www/chatgpt-on-aliyun/web
sudo mkdir -p /var/www/chatgpt-on-aliyun
sudo cp -r web /var/www/chatgpt-on-aliyun/

# 写入 nginx 配置
sudo tee /etc/nginx/sites-available/chat.conf >/dev/null <<'EOF'
server {
  listen 80;
  server_name YOUR_DOMAIN;
  root /var/www/chatgpt-on-aliyun/web;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    add_header X-Accel-Buffering no;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 7d;
    access_log off;
  }
}
EOF
sudo ln -sf /etc/nginx/sites-available/chat.conf /etc/nginx/sites-enabled/chat.conf
sudo nginx -t && sudo systemctl reload nginx

# 申请 HTTPS（推荐）
sudo snap install core && sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d YOUR_DOMAIN
```

## 4. 后端常驻（systemd）
```bash
sudo tee /etc/systemd/system/chatgpt.service >/dev/null <<'EOF'
[Unit]
Description=ChatGPT on Aliyun (Node API)
After=network.target

[Service]
Type=simple
Environment=PORT=3000
Environment=OPENAI_MODEL=gpt-4o-mini
Environment=CORS_ORIGIN=https://YOUR_DOMAIN
WorkingDirectory=/opt/chatgpt-on-aliyun
ExecStart=/usr/bin/node server/index.js
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now chatgpt.service
systemctl status chatgpt.service
```

## 5. 安全组 / 防火墙
- 阿里云控制台 > 安全组：放行 **80/443**（HTTP/HTTPS）。
- 若要临时直连 Node 端口，放行 **3000**（仅测试）。

## 6. 前端对接
- 浏览器访问 `https://YOUR_DOMAIN/` 打开网页；
- 前端默认调用同域 `/api/chat-stream`（流式）和 `/api/chat`（非流式）。

## 7. 常见问题
- 429 / 限流：降低请求频率或在 `express-rate-limit` 中调大阈值。
- CORS 错误：把 `server/.env` 的 `CORS_ORIGIN` 改为你的网站域名。
- 反代后流式不工作：确认 nginx 中 `proxy_buffering off; add_header X-Accel-Buffering no;`。
- Node 版本过低：请使用 **Node 20 LTS** 或更高。
