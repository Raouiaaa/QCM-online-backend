import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function listQuizzes() {
  // return id/title/category and question count
  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { id: 'asc' }
  });
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    category: q.category,
    questionsCount: q._count.questions,
    createdAt: q.createdAt
  }));
}

export async function getQuizWithQuestions(id) {
  return prisma.quiz.findUnique({
    where: { id: Number(id) },
    include: {
      questions: {
        orderBy: { id: 'asc' },
        include: {
          options: { orderBy: { id: 'asc' } }
        }
      }
    }
  });
}
