import prisma from '../config/db.js';


export const createUser = async (username, email, password) => {
    const newUser = await prisma.user.create({
        data: { username, email, password},
    });
    return newUser;
};


export const findUserByUsername = async (username) => {
    return prisma.User.findUnique({
        where: { username },
    });
};

export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
}
