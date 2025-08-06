-- CreateEnum
CREATE TYPE "public"."CompanySize" AS ENUM ('ME', 'EPP', 'GRANDE');

-- CreateEnum
CREATE TYPE "public"."EcacPJ" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "public"."EcacPF" AS ENUM ('SIM', 'NAO');

-- AlterTable
ALTER TABLE "public"."clients" ADD COLUMN     "codigoSimples" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "dataSituacao" TIMESTAMP(3),
ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "inicioAtividade" TIMESTAMP(3),
ADD COLUMN     "inicioEscritorio" TIMESTAMP(3),
ADD COLUMN     "porcPJEcac" "public"."EcacPJ",
ADD COLUMN     "porte" "public"."CompanySize",
ADD COLUMN     "procPFEcac" "public"."EcacPF";
