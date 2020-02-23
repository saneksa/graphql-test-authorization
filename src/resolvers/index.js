const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { isEmpty, isString } = require("lodash");
const path = require("path");

require("dotenv").config();

const errorHandler = error => {
  throw new Error(error);
};

const resolvers = {
  Query: {
    async allUsers(root, args, { user, errorName }) {
      if (!user) {
        errorHandler(errorName.UNAUTHORIZED);
      }
      return User.all();
    },
    async userById(root, { id }, { user, errorName }) {
      if (!user) {
        errorHandler(errorName.UNAUTHORIZED);
      }

      const userById = await User.findById(id);

      if (!userById) {
        errorHandler(errorName.NO_USER_WITH_THAT_ID);
      }

      return userById;
    },
    async currentUser(root, {}, { user, errorName }) {
      if (!user) {
        errorHandler(errorName.UNAUTHORIZED);
      }

      const currentUser = await User.findById(user.id);

      return currentUser;
    },
    async processList(root, {}, { user, errorName }) {
      if (!user) {
        errorHandler(errorName.UNAUTHORIZED);
      }

      const jsonData = require(path.resolve(__dirname, "processesList.json"));

      return jsonData;
    }
  },

  Mutation: {
    async signup(
      root,
      { firstName, secondName, email, password },
      { errorName }
    ) {
      const userWithEmail = await User.findOne({ where: { email } });

      if (userWithEmail) {
        errorHandler(errorName.EMAIL_IS_ALREADY_REGISTERED);
      }

      if (!email.includes("@")) {
        errorHandler(errorName.INVALID_EMAIL);
      }

      const user = await User.create({
        firstName,
        secondName,
        email,
        password: await bcrypt.hash(password, 10)
      });

      return jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    },

    async login(root, { email, password }, { errorName }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        errorHandler(errorName.NO_USER_WITH_THAT_EMAIL);
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        errorHandler(errorName.INCORRECT_PASSWORD);
      }

      return {
        token: jsonwebtoken.sign(
          {
            id: user.id,
            email: user.email
          },
          process.env.JWT_SECRET,
          { expiresIn: "1y" }
        ),
        user
      };
    },

    async editUser(
      root,
      { id, email, firstName, secondName, password },
      { user, errorName }
    ) {
      if (!user) {
        errorHandler(errorName.UNAUTHORIZED);
      }

      if (!email.includes("@")) {
        errorHandler(errorName.INVALID_EMAIL);
      }

      const userById = await User.findById(id);

      if (!userById) {
        errorHandler(errorName.NO_USER_FOUND);
      }

      if (isString(password) && isEmpty(password)) {
        errorHandler(errorName.INCORRECT_PASSWORD);
      }

      const pass = password ? await bcrypt.hash(password, 10) : undefined;

      await userById.update({
        email,
        firstName,
        secondName,
        password: pass
      });

      return userById;
    }
  }
};

module.exports = resolvers;
