const express = require('express');
const router = express.Router();

// ===== MIDDLEWARES =====

const {
  createUserValidations,
  checkValidations,
  loginValidations,
} = require('./usersValidators');

const {
  protectToken,
  userExists,
  protectAccountOwner,
} = require('./usersMiddlewares');

// ===== CONTROLLERS =====

const {
  createUser,
  login,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserOrders,
  getUserOrderDetails,
} = require('./usersController');

// ===== HTTP REQUEST =====

router.post('/singup', createUserValidations, checkValidations, createUser);
router.post('/login', loginValidations, login);
router.get('/', getAllUsers);

// ----- APPLY PROTECT TOKEN MIDDLEWARE -----

router.use(protectToken);

router.get('/orders', getUserOrders);
router.get('/orders/:orderId', getUserOrderDetails);
router
  .route('/:userId')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
