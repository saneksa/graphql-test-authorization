const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

require("dotenv").config();

const checkAuthenticated = async user => {
  if (!user) {
    throw new Error("You are not authenticated!");
  } else {
   const usr = await User.findById(user.id)
   if(!usr) {
    throw new Error("invalid token")
   }
    
  }
};

const resolvers = {
  Query: {
    async allUsers(root, args, { user }) {

      await checkAuthenticated(user);
      return User.all();
    },
    async userById(root, { id }, { user }) {

      await checkAuthenticated(user);
      const userById = await User.findById(id);

      if (!userById) {
        throw new Error("No user with that id");
      }

      return userById;
    },
    async currentUser(root, {}, { user }) {

      await checkAuthenticated(user);

      const currentUser = await User.findById(user.id);

      return currentUser;
    },
    async processList(root, {}, {user}) {
      await checkAuthenticated(user);

      const jsonData = require('./processesList.json');

      return jsonData
    }
  },

  Mutation: {
    async signup(root, { firstName, secondName, email, password }) {
      const userWithEmail = await User.findOne({ where: { email } });

      if (userWithEmail) {
        throw new Error("This email is already registered.");
      }

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
      { user }
    ) {
      await checkAuthenticated(user);

      if (!email.includes("@")) {
        throw new Error("invalid email");
      }

      const userById = await User.findById(id);

      if (!userById) {
        throw new Error("No user found");
      }

      await userById.update({
        email,
        firstName,
        secondName,
        password: password ? await bcrypt.hash(password, 10) : undefined
      });

      return userById;
    }
  }
};

module.exports = resolvers;
