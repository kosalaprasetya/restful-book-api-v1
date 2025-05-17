const jwt = require('../lib/jwt.js');
const bcrypt = require('../lib/bcrypt.js');
const UserModel = require('../models/users.model.js');
const AppError = require('../middlewares/appError.js');

class Authentication {
  static async Register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name) throw new AppError('Name is required!', 400, 'BAD REQUEST');
      if (!email) throw new AppError('Email is required!', 400, 'BAD REQUEST');
      if (!password) throw new AppError('Password is required!', 400, 'BAD REQUEST');

      const foundUserEmail = await UserModel.findUserByEmail(email);
      if (foundUserEmail) throw new AppError('Email has been taken', 403, 'FORBIDDEN');

      const newUser = {
        name,
        email,
        password: await bcrypt.hashPassword(password),
      };

      const createdUser = await UserModel.createUser(newUser);
      res.status(201).json({ success: 'true', id: createdUser.insertedId });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;

      const foundUser = await UserModel.findUserByEmail(email);
      if (!foundUser) throw new AppError('User Not Found!', 404, 'NOT FOUND');

      const isValidPassword = await bcrypt.comparePassword(password, foundUser.password);
      if (!isValidPassword) throw new AppError('Invalid Credentials!', 401, 'UNAUTHORIZED');

      const payload = {
        _id: foundUser._id,
        email: foundUser.email,
      };

      const token = jwt.signToken(payload);

      res.status(200).json({ success: true, accessToken: token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Authentication;
