import { z } from "zod";
import { publicProcedure } from "../trpc"; // Confirme se o caminho do seu trpc está correto
import { db } from "../db"; // Confirme o caminho do seu banco Drizzle
import { users } from "../schema"; 
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// Função para manter a criptografia no mesmo padrão do seu create-admin.mjs
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export const authRouter = {
  // ... (mantenha as suas rotas que já existem aqui, como login)

  // Adicione este bloco inteiro de register:
  register: publicProcedure
    .input(z.object({
      name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    }))
    .mutation(async ({ input }) => {
      // 1. Verifica se o e-mail já existe no banco
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado. Faça login.");
      }

      // 2. Criptografa a senha
      const hashed = await hashPassword(input.password);

      // 3. Salva o novo aluno
      await db.insert(users).values({
        name: input.name,
        email: input.email,
        password_hash: hashed,
        role: "user",
        active: 1, 
      });

      return { success: true, message: "Conta criada com sucesso!" };
    }),
};
