Backend (`VALIDADOR-BLOCKBIT`)

## 📌 Sobre
API de validação de clientes com geração/validação de tokens via e-mail, estatísticas para dashboard e histórico de tentativas.  
Arquitetura **MVC** com **Sequelize + PostgreSQL** (Docker), autenticação JWT e padronização com ESLint/Prettier.

## 🧱 Stack
- **Node.js + Express**
- **Sequelize** (ORM) + **PostgreSQL**
- **Docker**/**Docker Compose**
- **JWT** (login/sessões)
- **Yup** (validações)
- **@sendgrid/mail** (envio de chave por e-mail)
- **ESLint + Prettier + Sucrase + Nodemon**

## 📁 Estrutura (resumo)
```
src/
  app/
    controllers/
      SessionsController.js
      TokenController.js
      UserController.js
      StatsController.js
      ValidationHistoryController.js
    models/
      User.js
      AccessKey.js
      AccessKeyAttempt.js
    config/
      database.js
  database/
    migrations/
    seeders/
  routes.js
  server.js
```

## ⚙️ Variáveis de ambiente
Crie um `.env` na raiz do backend:
```env
# App
APP_PORT=3001
APP_URL=http://localhost:3001
JWT_SECRET=uma_chave_secreta_segura

# DB
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=validador

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxx
SENDGRID_FROM=kcoliveira@blockbit.com
```
## 🐘 Banco (Docker)
`docker-compose.yml` (exemplo básico):
```yaml
version: "3.8"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASS:-postgres}
      POSTGRES_DB: ${DB_NAME:-validador}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

**Subir o banco:**
```bash
docker compose up -d
```

## 📦 Instalação & Dev
```bash
# instalar deps
npm i

# criar DB/migrations
npx sequelize db:migrate

# (opcional) habilitar extensões de uuid no Postgres se for usar no DB:
# npx sequelize migration:create --name enable-uuid-ossp
# (na migration, execute CREATE EXTENSION IF NOT EXISTS "uuid-ossp")

# rodar em dev
# se usar sucrase no runtime, ajuste o script: node -r sucrase/register src/server.js
npm run dev
```

> A API sobe, por padrão, em **http://localhost:3001**.

## 🔐 Endpoints
### Auth & Usuários
- `POST /sessions` — login:
  ```json
  { "email": "admin@acme.com", "password": "123456" }
  ```
- `POST /users` — cadastro de usuário (admin opcional):
  ```json
  {
    "name":"Fulano",
    "email":"fulano@acme.com",
    "number_phone":"11999999999",
    "cnpj":"00.000.000/0001-00",
    "enterpriseName":"ACME",
    "password":"123456",
    "admin": false
  }
  ```
- `GET /users` — listagem paginada e com busca:
  ```
  /users?search=acme&page=1&limit=10&orderBy=created_at&order=DESC
  ```

### Tokens & Validação
- `POST /token/generate` — envia a chave por e-mail (SendGrid):
  ```json
  { "email": "cliente@dominio.com" }
  ```
- `POST /token/validate` — valida chave:
  ```json
  { "key": "AbCdEfG" }
  ```
  **Resposta (sucesso)**:
  ```json
  {
    "valid": true,
    "user": {
      "id": "...",
      "name": "Cliente",
      "email": "cliente@dominio.com",
      "number_phone": "1199...",
      "cnpj": "00.000...",
      "enterpriseName": "Empresa X"
    }
  }
  ```

### Dashboard / Histórico
- `GET /stats` — totais para cards/gráficos:
  ```json
  {
    "clients": 42,
    "tokens": 128,
    "validation": { "valid": 80, "invalid": 48 }
  }
  ```
- `GET /validation/history?limit=10&page=1` — últimas validações:
  ```json
  {
    "data":[
      {
        "id":"...",
        "key":"AbC***",
        "email":"cliente@x.com",
        "success":true,
        "reason":null,
        "created_at":"2025-01-01T12:00:00Z"
      }
    ],
    "meta":{"page":1,"limit":10,"total":30,"totalPages":3}
  }
  ```

## 🧪 Troubleshooting
- **500 no `/validation/history`**: garanta a migration `access_key_attempts` aplicada e o model `AccessKeyAttempt` registrado na `src/database/index.js`.
- **CORS**: habilite `cors()` no `app.js`.
- **SendGrid**: verifique `SENDGRID_API_KEY` e `SENDGRID_FROM` verificado no painel.
- **UUID**: se gerar no DB, habilite `uuid-ossp` ou `pgcrypto` e use `Sequelize.literal('uuid_generate_v4()')`/`gen_random_uuid()` nas migrations.

