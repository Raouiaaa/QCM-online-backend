import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createResult({ userId, quizId, score }) {
  // store result row
  const result = await prisma.result.create({
    data: { userId, quizId, score }
  });

  // update user's last score
  await prisma.user.update({
    where: { id: userId },
    data: { score }
  });

  return result;
}
