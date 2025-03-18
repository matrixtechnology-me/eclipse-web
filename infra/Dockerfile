# Use a imagem base do Node.js com Alpine
FROM node:22.14-alpine

# Habilite o Corepack e prepare o pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências (package.json e pnpm-lock.yaml)
COPY ../package.json ../pnpm-lock.yaml ../prisma ./

# Instale as dependências
RUN pnpm install --frozen-lockfile

# Copie o restante do código-fonte
COPY ../ ./

# Gere o cliente do Prisma e construa o projeto
RUN pnpm prisma generate && pnpm build

# Defina as variáveis de ambiente
ARG DATABASE_URL
ARG COGNITO_AUTH_DYNAMO_TABLE_NAME_ADM
ARG COGNITO_AUTH_DYNAMO_TABLE_NAME_STUDENT
ARG PUBLIC_API_BASE_URL

ENV DATABASE_URL=$DATABASE_URL \
    COGNITO_AUTH_DYNAMO_TABLE_NAME_ADM=$COGNITO_AUTH_DYNAMO_TABLE_NAME_ADM \
    COGNITO_AUTH_DYNAMO_TABLE_NAME_STUDENT=$COGNITO_AUTH_DYNAMO_TABLE_NAME_STUDENT \
    PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL

# Use um usuário não-root para segurança
USER node

# Exponha a porta 3001
EXPOSE 3001

# Comando padrão para iniciar a aplicação
CMD ["pnpm", "start"]