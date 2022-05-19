const jwt = require('jsonwebtoken');

// ===== MODELS =====

const { User } = require('./userModel');

// ===== UTILS =====

const { catchAsync } = require('../../utils/catchAsync');
const { AppError } = require('../../utils/appError');

// =================

const userExists = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return next(new AppError('User does not exist with given Id', 404));
  }

  // Add user data to the req object

  req.user = user;

  next();
});

const protectToken = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const user = await User.findOne({
    where: { id: decoded.id, status: 'available' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer available', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 403));
  }

  next();
});

const adminAccess = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== 'admin') {
    return next(new AppError('Unauthorized access', 403));
  }
  next();
});

module.exports = { protectToken, userExists, protectAccountOwner, adminAccess };
