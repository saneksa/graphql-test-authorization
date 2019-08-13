const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const resolvers = {
  Query: {
    async allUsers(root, args, { user }) {
      if (!user) {
        throw new Error("You are not authenticated!");
      }
      return User.all();
    },
    async userById(root, { id }, { user }) {
      if (!user) {
        throw new Error("You are not authenticated!");
      }

      const userById = await User.findByPk(id);

      if (!userById) {
        throw new Error("No user with that id");
      }
      return userById;
    }
  },

  Mutation: {
    async signup(root, { firstName, secondName, email, password }) {
      const user = await User.create({
        firstName,
        secondName,
        email,
        password: await bcrypt.hash(password, 10)
      });

      if (!email.includes("@")) {
        throw new Error("invalid email");
      }

      return jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    },

    async login(root, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Incorrect password");
      }

      return jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    },

    async editUser(
      root,
      { id, email, firstName, secondName, password },
      { user }
    ) {
      if (!user) {
        throw new Error("You are not authenticated!");
      }

      if (!email.includes("@")) {
        throw new Error("invalid email");
      }

      const userById = await User.findByPk(id);

      if (!userById) {
        throw new Error("No user found");
      }

      await userById.update({ email, firstName, secondName, password });

      return userById;
    }
  }
};

module.exports = resolvers;
