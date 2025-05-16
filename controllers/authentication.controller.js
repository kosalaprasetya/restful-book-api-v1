const jwt = require('../lib/jwt.js');
const bcrypt = require('../lib/bcrypt.js');
const userModel = require('../models/user.model.js');
const appError = require('../middlewares/appError.js');

class Authentication {
  static async Register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name) throw new appError('Name is required!', 400, 'BAD REQUEST');
      if (!email) throw new appError('Email is required!', 400, 'BAD REQUEST');
      if (!password) throw new appError('Password is required!', 400, 'BAD REQUEST');

      const foundUserEmail = await userModel.findUserByEmail(email);
      if (foundUserEmail) throw new appError('Email has been taken', 403, 'FORBIDDEN');

      const newUser = {
        name,
        email,
        password: await bcrypt.hashPassword(password),
      };

      const createdUser = await userModel.createUser(newUser);
      res.status(201).json({ success: 'true', id: createdUser.insertedId });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;

      const foundUser = await userModel.findUserByEmail(email);
      if (!foundUser) throw new appError('User Not Found!', 404, 'NOT FOUND');

      const isValidPassword = await bcrypt.comparePassword(password, foundUser.password);
      if (!isValidPassword) throw new appError('Invalid Credentials!', 401, 'UNAUTHORIZED');

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
