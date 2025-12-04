-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "CNPJ" TEXT,
    "email" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" SERIAL NOT NULL,
    "dta_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dta_conclusao" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "funcionarioID" INTEGER NOT NULL,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_funcionarioID_fkey" FOREIGN KEY ("funcionarioID") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
