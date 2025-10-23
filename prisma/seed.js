import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const questions = [
  {
    text: "What does REST stand for?",
    difficulty: "easy",
    options: [
      { description: "Representational State Transfer", isTrue: true },
      { description: "Remote Execution Service Transport", isTrue: false },
      { description: "Random Event Synchronous Transfer", isTrue: false },
      { description: "Resource Emulation State Table", isTrue: false },
    ],
  },
  {
    text: "Which HTTP method is idempotent by definition?",
    difficulty: "medium",
    options: [
      { description: "POST", isTrue: false },
      { description: "GET", isTrue: true },
      { description: "PATCH", isTrue: false },
      { description: "CONNECT", isTrue: false },
    ],
  },
  {
    text: "Which React hook creates local state?",
    difficulty: "easy",
    options: [
      { description: "useReducer", isTrue: false },
      { description: "useState", isTrue: true },
      { description: "useMemo", isTrue: false },
      { description: "useEffect", isTrue: false },
    ],
  },
  {
    text: "Primary role of Prisma in a Node.js app?",
    difficulty: "medium",
    options: [
      { description: "UI component library", isTrue: false },
      { description: "ORM for DB access & schema", isTrue: true },
      { description: "Routing framework", isTrue: false },
      { description: "Testing framework", isTrue: false },
    ],
  },
  {
    text: "Which is NOT part of MERN?",
    difficulty: "easy",
    options: [
      { description: "MongoDB", isTrue: false },
      { description: "Express.js", isTrue: false },
      { description: "React", isTrue: false },
      { description: "Django", isTrue: true },
    ],
  },
  {
    text: "HTML5 attribute to enforce required input:",
    difficulty: "easy",
    options: [
      { description: "mustfill", isTrue: false },
      { description: "required", isTrue: true },
      { description: "mandatory", isTrue: false },
      { description: "validate", isTrue: false },
    ],
  },
  {
    text: "Which SQL clause filters rows?",
    difficulty: "medium",
    options: [
      { description: "WHERE", isTrue: true },
      { description: "FILTER", isTrue: false },
      { description: "GROUP BY", isTrue: false },
      { description: "ORDER BY", isTrue: false },
    ],
  },
  {
    text: "useEffect mainly replaces which lifecycle(s)?",
    difficulty: "medium",
    options: [
      { description: "componentDidMount / componentDidUpdate", isTrue: true },
      { description: "shouldComponentUpdate", isTrue: false },
      { description: "getDerivedStateFromProps", isTrue: false },
      { description: "componentDidCatch", isTrue: false },
    ],
  },
  {
    text: "Node.js event loop primarily handles…",
    difficulty: "medium",
    options: [
      { description: "DB schema migrations", isTrue: false },
      { description: "Async callbacks & tasks", isTrue: true },
      { description: "CSS rendering", isTrue: false },
      { description: "Binary compilation", isTrue: false },
    ],
  },
  {
    text: "Which library uses reducers & a single store?",
    difficulty: "hard",
    options: [
      { description: "Redux", isTrue: true },
      { description: "Axios", isTrue: false },
      { description: "Bootstrap", isTrue: false },
      { description: "Lodash", isTrue: false },
    ],
  },
];

async function main() {
  // Create (or reuse) the quiz
  const quiz = await prisma.quiz.upsert({
    where: { id: 1 },
    update: {},
    create: { title: 'Fullstack Fundamentals', category: 'Fullstack' },
  });

  // Make seeding idempotent: remove old questions/options for this quiz
  await prisma.option.deleteMany({
    where: { question: { quizId: quiz.id } },
  });
  await prisma.question.deleteMany({
    where: { quizId: quiz.id },
  });

  // Re-insert questions and options (no skipDuplicates)
  for (const q of questions) {
    const createdQ = await prisma.question.create({
      data: {
        text: q.text,
        difficulty: q.difficulty,
        quizId: quiz.id,
      },
    });

    await prisma.option.createMany({
      data: q.options.map(o => ({
        description: o.description,
        isTrue: o.isTrue,
        questionId: createdQ.id,
      })),
    });
  }

  console.log('✅ Seed complete. Quiz ID:', quiz.id);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

