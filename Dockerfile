# ベースステージ
FROM node:24.11.0-alpine AS base

# セキュリティ: 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# 依存関係ステージ
FROM base AS deps

# 依存関係のキャッシュ最適化
COPY package*.json ./
RUN npm ci

# 開発環境ステージ
FROM base AS development

RUN apk add --no-cache git && git config --global --add safe.directory /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ビルドステージ
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 本番環境ステージ
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Nginxの設定 (SPAのルーティング対応)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
