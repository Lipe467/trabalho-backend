const prisma = require("./prisma");

const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const findUserById = (id) => {
  return prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
    },
    where: {
      id,
    },
  });
};

const saveUser = (user) => {
  return prisma.user.create({
    data: user,
  });
};

module.exports = {
  saveUser,
  findUserByEmail,
  findUserById,
};
