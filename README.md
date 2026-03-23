# RemboSite

Сайт на `Next.js 16 + Payload CMS 3`.

## Что внутри

- Главная страница с Discord live-статусом
- Портфолио по категориям (`skills` + `projects`)
- Страница друзей/коллабораций (`collaborators`)
- Live chat без авторизации (`chat-messages`)
- Админка Payload: `/admin`

## Стек

- Next.js 16 (App Router)
- Payload CMS 3
- SQLite (`payload.db`)
- TypeScript

## Локальный запуск

1. Установить зависимости:

```bash
npm install
```

2. Подготовить переменные окружения:

```bash
cp .env.example .env.local
```

3. Запустить проект:

```bash
npm run dev
```

Откроется:

- frontend: `http://localhost:3000`
- admin: `http://localhost:3000/admin`

## Полезные команды

```bash
npm run lint
npm run build
npm run start
npm run generate:types
npm run generate:importmap
npm run seed:content
```

## CMS-контент

- Глобальные настройки сайта: `site-content`
- Категории портфолио: `skills`
- Карточки проектов: `projects`
- Карточки друзей: `collaborators`
- Сообщения чата: `chat-messages`
- Кастомные страницы-конструктор: `pages`

`chat-messages` можно редактировать и удалять в CMS (для авторизованного админа).

## Подготовка к Git

Перед коммитом:

```bash
npm run lint
npm run build
```

В репозиторий **не** должны попадать:

- `.env*`
- `payload.db*`
- `.next/`
- `node_modules/`

## Деплой на VPS (production)

Ниже минимальный рабочий сценарий для Ubuntu + Nginx + systemd.

### 1. Установить Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

### 2. Клонировать проект

```bash
git clone <YOUR_REPO_URL> rembo-site
cd rembo-site
npm ci
```

### 3. Переменные окружения

Создай `.env.local`:

```env
PAYLOAD_SECRET=<strong-random-secret>
DATABASE_URL=file:./payload.db
```

### 4. Сборка и запуск

```bash
npm run build
PORT=3000 npm run start
```

### 5. systemd сервис

Создай `/etc/systemd/system/rembo-site.service`:

```ini
[Unit]
Description=RemboSite Next.js + Payload
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/rembo-site
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Команды:

```bash
sudo systemctl daemon-reload
sudo systemctl enable rembo-site
sudo systemctl start rembo-site
sudo systemctl status rembo-site
```

### 6. Nginx reverse proxy

Пример `/etc/nginx/sites-available/rembo-site`:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/rembo-site /etc/nginx/sites-enabled/rembo-site
sudo nginx -t
sudo systemctl reload nginx
```

## Важно по безопасности

- Не хранить root-пароли в репозитории и чатах.
- Использовать SSH-ключи вместо пароля.
- `PAYLOAD_SECRET` должен быть длинным случайным значением.
