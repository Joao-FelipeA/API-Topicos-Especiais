/*
  Warnings:

  - You are about to drop the column `funcionarioID` on the `servicos` table. All the data in the column will be lost.
  - Added the required column `funcionarioId` to the `servicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivo` to the `servicos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."servicos" DROP CONSTRAINT "servicos_funcionarioID_fkey";

-- AlterTable
ALTER TABLE "servicos" DROP COLUMN "funcionarioID",
ADD COLUMN     "funcionarioId" INTEGER NOT NULL,
ADD COLUMN     "motivo" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
