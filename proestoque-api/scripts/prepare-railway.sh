#!/bin/bash

# Script para preparar o projeto para deploy na Railway
# Troca SQLite por PostgreSQL no schema e migration lock

echo "🚂 Preparando para deploy na Railway..."

# Troca o provider no schema.prisma
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Troca o provider no migration_lock.toml
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/migrations/migration_lock.toml

# Substitui o migration SQL por um compatível com PostgreSQL
cat > prisma/migrations/20260625000000_init_sqlite/migration.sql << 'ENDSQL'
-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "refreshToken" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidadeMinima" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL,
    "foto" TEXT,
    "observacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "observacao" TEXT,
    "produtoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ENDSQL

echo "✅ Schema e migrations atualizados para PostgreSQL!"
echo ""
echo "📌 Agora configure no Railway:"
echo "   DATABASE_URL = (URL do PostgreSQL do Railway)"
echo "   JWT_SECRET   = (sua chave secreta)"
echo "   JWT_EXPIRES_IN = 7d"
echo "   REFRESH_TOKEN_SECRET = (sua chave de refresh)"
echo ""
echo "🔧 Para restaurar SQLite local depois: npm run dev:restore"
