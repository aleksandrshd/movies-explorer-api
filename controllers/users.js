const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { httpStatusCodes, messages } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    return res.status(httpStatusCodes.created).json({
      name: user.name,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new BadRequestError(`${messages.userCreateInvData} ${errors.join(', ')}`));
    }
    if (err.code === 11000) {
      return next(new ConflictError(messages.userEmailAlreadyExist));
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new NotFoundError(messages.userIdNotFound));
    }

    return res.json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new BadRequestError(`${messages.userPatchInvData} ${errors.join(', ')}`));
    }
    if (err.code === 11000) {
      return next(new ConflictError(messages.userEmailAlreadyExist));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError(messages.userInvEmailOrPassword));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError(messages.userInvEmailOrPassword);
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

const getCurrentUserInfo = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);

    if (!user) {
      return next(new NotFoundError(messages.userIdNotFound));
    }

    return res.json({
      name: user.name,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError(messages.userInvalidId));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUserInfo,
};
