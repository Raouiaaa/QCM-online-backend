import prisma from '../config/db.js';


export const createUser = async (username, email, password) => {
    const newUser = await prisma.user.create({
        data: { username, email, password},
    });
    return newUser;
};


export const findUserByUsername = async (username) => {
    return prisma.user.findUnique({
        where: { username },
    });
};

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
}

export const updateUserScoreById = async (id, score) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: { score },
      select: { id: true, username: true, email: true, score: true }
    });
  } catch (e) {
    if (e.code === "P2025") return null; // record not found
    throw e;
  }
};
